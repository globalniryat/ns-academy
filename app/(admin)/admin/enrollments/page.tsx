import { prisma } from "@/lib/prisma";
import EnrollmentsTable from "@/components/admin/EnrollmentsTable";
import { ClipboardList } from "lucide-react";

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { enrolledAt: "desc" },
    take: 1000,
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
    },
  });

  const serialized = enrollments.map((e) => ({
    id: e.id,
    status: e.status,
    enrolledAt: e.enrolledAt.toISOString(),
    expiresAt: e.expiresAt?.toISOString() ?? null,
    completedAt: e.completedAt?.toISOString() ?? null,
    user: { id: e.user.id, name: e.user.name, email: e.user.email },
    course: { id: e.course.id, title: e.course.title },
  }));

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-muted" />
            Enrollments
          </h1>
          <p className="text-muted text-sm mt-1">{serialized.length} total enrollments</p>
        </div>
      </div>

      <EnrollmentsTable enrollments={serialized} />
    </div>
  );
}
