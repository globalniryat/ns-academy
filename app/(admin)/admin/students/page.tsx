import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DataTable from "@/components/admin/DataTable";

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

  const tableData = students.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone ?? "—",
    enrollments: s._count.enrollments,
    certificates: s._count.certificates,
    joined: new Date(s.createdAt).toLocaleDateString("en-IN"),
    isActive: s.isActive,
  }));

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Students</h1>
        <p className="text-muted text-sm mt-1">{students.length} registered students</p>
      </div>

      <DataTable
        data={tableData}
        searchKeys={["name", "email"]}
        columns={[
          {
            key: "name",
            label: "Student",
            render: (row) => (
              <div>
                <Link href={`/admin/students/${row.id}`} className="text-sm font-semibold text-navy hover:text-blue transition-colors">
                  {row.name as string}
                </Link>
                <p className="text-xs text-muted">{row.email as string}</p>
              </div>
            ),
          },
          { key: "phone", label: "Phone" },
          { key: "enrollments", label: "Enrollments" },
          { key: "certificates", label: "Certificates" },
          { key: "joined", label: "Joined" },
          {
            key: "isActive",
            label: "Status",
            render: (row) => (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}>
                {row.isActive ? "Active" : "Inactive"}
              </span>
            ),
          },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <Link href={`/admin/students/${row.id}`} className="text-xs text-blue hover:underline">
                View →
              </Link>
            ),
          },
        ]}
        emptyMessage="No students yet."
      />
    </div>
  );
}
