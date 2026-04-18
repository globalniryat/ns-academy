import Link from "next/link";
import { ArrowLeft, BookOpen, CreditCard, Award, TrendingUp, IndianRupee } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StatusBadge, { toVariant } from "@/components/admin/StatusBadge";
import StudentEnrollmentManager from "@/components/admin/StudentEnrollmentManager";
import DeleteStudentButton from "@/components/admin/DeleteStudentButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;

  const [student, progressData, totalSpend, publishedCourses] = await Promise.all([
    prisma.profile.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { course: { select: { id: true, title: true, slug: true } } },
          orderBy: { enrolledAt: "desc" },
        },
        payments: {
          include: { course: { select: { title: true } } },
          orderBy: { createdAt: "desc" },
        },
        certificates: {
          include: { course: { select: { title: true } } },
          orderBy: { issuedAt: "desc" },
        },
      },
    }),
    prisma.lessonProgress.groupBy({
      by: ["lessonId"],
      where: { userId: id, isCompleted: true },
      _count: { isCompleted: true },
    }),
    prisma.payment.aggregate({
      where: { userId: id, status: "CAPTURED" },
      _sum: { amount: true },
    }),
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true, level: true },
      orderBy: { title: "asc" },
    }),
  ]);

  if (!student) notFound();

  const enrolledCourseIds = student.enrollments.map((e) => e.course.id);

  // Single batch query — fetch all lessons for all enrolled courses at once
  const [allLessons, completedCourses] = await Promise.all([
    prisma.lesson.findMany({
      where: { section: { courseId: { in: enrolledCourseIds } } },
      select: { id: true, section: { select: { courseId: true } } },
    }),
    Promise.resolve(new Set(progressData.map((p) => p.lessonId))),
  ]);

  // Group lesson totals per course
  const lessonsByCourse = new Map<string, { total: number; completed: number }>();
  for (const lesson of allLessons) {
    const cid = lesson.section.courseId;
    const entry = lessonsByCourse.get(cid) ?? { total: 0, completed: 0 };
    entry.total++;
    if (completedCourses.has(lesson.id)) entry.completed++;
    lessonsByCourse.set(cid, entry);
  }

  const courseProgress = student.enrollments.map((e) => {
    const stats = lessonsByCourse.get(e.course.id) ?? { total: 0, completed: 0 };
    return { courseId: e.course.id, title: e.course.title, ...stats };
  });

  const totalSpendRupees = Math.round((totalSpend._sum.amount ?? 0) / 100);
  const enrollmentsSerialized = student.enrollments.map((e) => ({
    id: e.id,
    courseId: e.course.id,
    status: e.status,
    enrolledAt: e.enrolledAt.toISOString(),
    expiresAt: e.expiresAt?.toISOString() ?? null,
    course: { title: e.course.title },
  }));

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Back */}
      <Link href="/admin/students" className="flex items-center gap-1.5 text-sm text-muted hover:text-blue transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </Link>

      {/* Student header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue/10 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-blue">
              {student.name?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-heading text-2xl font-bold text-navy">{student.name}</h1>
                <p className="text-muted text-sm mt-0.5">
                  {student.email}
                  {student.phone ? ` · ${student.phone}` : ""}
                </p>
                <p className="text-muted text-xs mt-1">
                  Joined {new Date(student.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge variant={student.isActive ? "active" : "expired"} label={student.isActive ? "Active" : "Inactive"} />
                <DeleteStudentButton studentId={id} studentName={student.name} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100">
          {[
            { label: "Enrollments", value: student.enrollments.length, icon: BookOpen },
            { label: "Certificates", value: student.certificates.length, icon: Award },
            { label: "Payments", value: student.payments.length, icon: CreditCard },
            { label: "Total Spent", value: `₹${totalSpendRupees.toLocaleString("en-IN")}`, icon: IndianRupee },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="w-4 h-4 text-muted mx-auto mb-1" />
              <p className="font-heading font-bold text-navy text-lg">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress */}
      {courseProgress.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading font-bold text-navy flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-muted" />
            Learning Progress
          </h2>
          <div className="space-y-4">
            {courseProgress.map((cp) => {
              const pct = cp.total > 0 ? Math.round((cp.completed / cp.total) * 100) : 0;
              return (
                <div key={cp.courseId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-navy line-clamp-1">{cp.title}</p>
                    <span className="text-xs text-muted shrink-0 ml-3">
                      {cp.completed}/{cp.total} lessons · {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enrollments — with inline status management */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading font-bold text-navy flex items-center gap-2 mb-5">
          <BookOpen className="w-4 h-4 text-muted" />
          Enrollments ({student.enrollments.length})
        </h2>
        <StudentEnrollmentManager
          userId={id}
          initialEnrollments={enrollmentsSerialized}
          courses={publishedCourses}
        />
      </div>

      {/* Payments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading font-bold text-navy flex items-center gap-2 mb-5">
          <CreditCard className="w-4 h-4 text-muted" />
          Payments ({student.payments.length})
        </h2>
        {student.payments.length === 0 ? (
          <p className="text-muted text-sm">No payments yet.</p>
        ) : (
          <div className="space-y-2">
            {student.payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy">{p.course.title}</p>
                  <p className="text-xs text-muted font-mono mt-0.5">{p.razorpayOrderId ?? p.id}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-bold text-navy">₹{Math.round(p.amount / 100).toLocaleString("en-IN")}</p>
                  <div className="mt-1">
                    <StatusBadge variant={toVariant(p.status)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates */}
      {student.certificates.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-heading font-bold text-navy flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-muted" />
            Certificates ({student.certificates.length})
          </h2>
          <div className="space-y-2">
            {student.certificates.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy">{c.course.title}</p>
                  <p className="text-xs text-muted font-mono">{c.certificateNo}</p>
                </div>
                <p className="text-xs text-muted shrink-0 ml-4">
                  {new Date(c.issuedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
