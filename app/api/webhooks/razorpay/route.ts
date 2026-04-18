import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const sigBuffer = Buffer.from(signature, "hex");
  const expBuffer = Buffer.from(expected, "hex");
  try {
    return sigBuffer.length === expBuffer.length && crypto.timingSafeEqual(sigBuffer, expBuffer);
  } catch {
    return false;
  }
}

interface RazorpayWebhookEvent {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        method?: string;
        error_code?: string;
        error_description?: string;
        error_reason?: string;
        notes?: Record<string, string>;
      };
    };
  };
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook/razorpay] RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  if (!verifyWebhookSignature(body, signature, secret)) {
    console.warn("[webhook/razorpay] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment) return NextResponse.json({ ok: true });

  try {
    if (event.event === "payment.captured") {
      const { courseId, userId } = payment.notes ?? {};
      if (!courseId || !userId) {
        console.warn("[webhook/razorpay] payment.captured missing notes", payment.id);
        return NextResponse.json({ ok: true });
      }

      await prisma.payment.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: {
          status: "CAPTURED",
          razorpayPaymentId: payment.id,
        },
      });

      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {},
        create: { userId, courseId, status: "ACTIVE" },
      });

      console.info(`[webhook/razorpay] Enrollment ensured user=${userId} course=${courseId}`);
    }

    if (event.event === "payment.failed") {
      const failureReason = [
        payment.error_reason,
        payment.error_description,
      ].filter(Boolean).join(" — ") || "Unknown";

      await prisma.payment.updateMany({
        where: { razorpayOrderId: payment.order_id },
        data: {
          status: "FAILED",
          razorpayPaymentId: payment.id,
          failureReason,
        },
      });

      console.info(`[webhook/razorpay] Payment failed order=${payment.order_id} reason=${failureReason}`);
    }
  } catch (err) {
    console.error("[webhook/razorpay] DB error", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
