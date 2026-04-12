import Link from "next/link";
import { ArrowLeft, BookOpen, CreditCard, Award } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;

  const student = await prisma.profile.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: { course: { select: { title: true, slug: true } } },
        orderBy: { enrolledAt: "desc" },
      },
      payments: {
        include: { course: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      certificates: {
        include: { course: { select: { title: true } } },
        orderBy: { issuedAt: "desc" },
      },
    },
  });

  if (!student) notFound();

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/students" className="flex items-center gap-1.5 text-sm text-muted hover:text-blue transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">{student.name}</h1>
        <p className="text-muted text-sm">{student.email}{student.phone ? ` · ${student.phone}` : ""}</p>
        <p className="text-muted text-xs mt-1">
          Joined {new Date(student.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
        </p>
      </div>

      {/* Enrollments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading font-bold text-navy flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4" />
          Enrollments ({student.enrollments.length})
        </h2>
        {student.enrollments.length === 0 ? (
          <p className="text-muted text-sm">No enrollments yet.</p>
        ) : (
          <div className="space-y-2">
            {student.enrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy">{e.course.title}</p>
                  <p className="text-xs text-muted">{new Date(e.enrolledAt).toLocaleDateString("en-IN")}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  e.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-blue/10 text-blue"
                }`}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading font-bold text-navy flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4" />
          Payments
        </h2>
        {student.payments.length === 0 ? (
          <p className="text-muted text-sm">No payments yet.</p>
        ) : (
          <div className="space-y-2">
            {student.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy">{p.course.title}</p>
                  <p className="text-xs text-muted font-mono">{p.razorpayOrderId ?? p.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-navy">₹{Math.round(p.amount / 100).toLocaleString("en-IN")}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.status === "CAPTURED" ? "bg-green-100 text-green-700" : p.status === "FAILED" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates */}
      {student.certificates.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading font-bold text-navy flex items-center gap-2 mb-4">
            <Award className="w-4 h-4" />
            Certificates ({student.certificates.length})
          </h2>
          <div className="space-y-2">
            {student.certificates.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy">{c.course.title}</p>
                  <p className="text-xs text-muted font-mono">{c.certificateNo}</p>
                </div>
                <p className="text-xs text-muted">{new Date(c.issuedAt).toLocaleDateString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
