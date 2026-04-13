import Link from "next/link";
import { CheckCircle, XCircle, Award, GraduationCap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ certificateNo: string }>;
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { certificateNo } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { certificateNo: decodeURIComponent(certificateNo) },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true, level: true } },
    },
  });

  const isValid = !!certificate;

  return (
    <div className="min-h-screen bg-offwhite pt-24 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {isValid ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            {/* Valid icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <CheckCircle className="w-3.5 h-3.5" />
              Certificate Verified
            </div>

            <h1 className="font-heading text-2xl font-bold text-navy mb-2">
              Valid Certificate
            </h1>
            <p className="text-muted text-sm mb-8">
              This certificate was issued by NS Academy and is authentic.
            </p>

            {/* Certificate details */}
            <div className="bg-navy/5 rounded-2xl p-5 text-left space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue/10 rounded-lg flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4.5 h-4.5 text-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-0.5">Student Name</p>
                  <p className="font-semibold text-navy">{certificate.user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue/10 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-4.5 h-4.5 text-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-0.5">Course</p>
                  <p className="font-semibold text-navy">{certificate.course.title}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue/10 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-4.5 h-4.5 text-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-0.5">Date Issued</p>
                  <p className="font-semibold text-navy">
                    {certificate.issuedAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted mb-6">
              Certificate No: <span className="font-mono font-medium text-navy">{certificate.certificateNo}</span>
            </p>

            <Link href="/">
              <Button variant="outline" className="w-full">
                Visit NS Academy
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            {/* Invalid icon */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
              <XCircle className="w-3.5 h-3.5" />
              Certificate Not Found
            </div>

            <h1 className="font-heading text-2xl font-bold text-navy mb-2">
              Invalid Certificate
            </h1>
            <p className="text-muted text-sm mb-3">
              The certificate number{" "}
              <span className="font-mono font-semibold text-navy">
                {decodeURIComponent(certificateNo)}
              </span>{" "}
              does not match any issued certificate.
            </p>
            <p className="text-muted text-sm mb-8">
              Please check the certificate number and try again, or contact NS Academy for verification.
            </p>

            <div className="space-y-3">
              <Link href="/">
                <Button variant="default" className="w-full">
                  Visit NS Academy
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
