"use client";

import Link from "next/link";
import DataTable from "./DataTable";

interface StudentRow {
  id: string;
  name: string | null;
  email: string;
  phone: string;
  enrollments: number;
  certificates: number;
  joined: string;
  isActive: boolean;
}

export default function StudentsTable({ data }: { data: StudentRow[] }) {
  return (
    <DataTable
      data={data}
      searchKeys={["name", "email"]}
      columns={[
        {
          key: "name",
          label: "Student",
          render: (row) => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-blue">
                  {(row.name as string)?.charAt(0)?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div>
                <Link
                  href={`/admin/students/${row.id}`}
                  className="text-sm font-semibold text-navy hover:text-blue transition-colors"
                >
                  {row.name as string}
                </Link>
                <p className="text-xs text-muted">{row.email as string}</p>
              </div>
            </div>
          ),
        },
        { key: "phone", label: "Phone" },
        {
          key: "enrollments",
          label: "Enrolled",
          render: (row) => (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue/10 text-xs font-bold text-blue">
              {row.enrollments as number}
            </span>
          ),
        },
        {
          key: "certificates",
          label: "Certs",
          render: (row) => (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-50 text-xs font-bold text-green-600">
              {row.certificates as number}
            </span>
          ),
        },
        { key: "joined", label: "Joined" },
        {
          key: "isActive",
          label: "Status",
          render: (row) => (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                row.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {row.isActive ? "Active" : "Inactive"}
            </span>
          ),
        },
        {
          key: "actions",
          label: "",
          render: (row) => (
            <Link
              href={`/admin/students/${row.id}`}
              className="text-xs text-blue hover:underline font-medium"
            >
              View →
            </Link>
          ),
        },
      ]}
      emptyMessage="No students yet."
    />
  );
}
