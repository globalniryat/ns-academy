import { prisma } from "@/lib/prisma";
import PaymentsClient from "@/components/admin/PaymentsClient";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  const serialized = payments.map((p) => ({
    id: p.id,
    userName: p.user.name,
    userEmail: p.user.email,
    courseTitle: p.course.title,
    amount: p.amount,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    razorpayOrderId: p.razorpayOrderId,
  }));

  return <PaymentsClient payments={serialized} />;
}
