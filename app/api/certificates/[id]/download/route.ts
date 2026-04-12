import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { CertificatePDFDocument } from "@/lib/certificate-pdf";
import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true, instructor: true } },
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Only allow the certificate owner to download
    if (certificate.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(CertificatePDFDocument, {
        studentName: certificate.user.name,
        courseTitle: certificate.course.title,
        certificateNo: certificate.certificateNo,
        issuedAt: certificate.issuedAt,
        instructorName: certificate.course.instructor,
      })
    );

    const filename = `certificate-${certificate.certificateNo}.pdf`;

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[GET /api/certificates/[id]/download]", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
