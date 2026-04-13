import { prisma } from "@/lib/prisma";
import StudentsTable from "@/components/admin/StudentsTable";
import { Users } from "lucide-react";

export default async function AdminStudentsPage() {
  const students = await prisma.profile.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
      _count: { select: { enrollments: true, certificates: true } },
    },
  });

  const activeCount = students.filter((s) => s.isActive).length;

  const tableData = students.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone ?? "—",
    enrollments: s._count.enrollments,
    certificates: s._count.certificates,
    joined: new Date(s.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    isActive: s.isActive,
  }));

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Students</h1>
          <p className="text-muted text-sm mt-1">
            {students.length} registered · {activeCount} active
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-blue" />
        </div>
      </div>

      <StudentsTable data={tableData} />
    </div>
  );
}
