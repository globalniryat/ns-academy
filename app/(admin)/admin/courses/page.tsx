import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const levelVariantMap: Record<string, "foundation" | "intermediate" | "final"> = {
  FOUNDATION: "foundation",
  INTERMEDIATE: "intermediate",
  FINAL: "final",
};

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { enrollments: true, sections: true } } },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Courses</h1>
          <p className="text-muted text-sm mt-1">{courses.length} total courses</p>
        </div>
        <Link href="/admin/courses/new">
          <Button variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            New Course
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "Level", "Status", "Price", "Enrollments", "Sections", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-navy line-clamp-1 max-w-[220px]">{course.title}</p>
                  <p className="text-xs text-muted font-mono">{course.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={levelVariantMap[course.level] ?? "foundation"}>
                    {course.level}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    course.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : course.status === "ARCHIVED"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-bodytext whitespace-nowrap">
                  ₹{Math.round(course.price / 100).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-sm text-bodytext">{course._count.enrollments}</td>
                <td className="px-4 py-3 text-sm text-bodytext">{course._count.sections}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            No courses yet.{" "}
            <Link href="/admin/courses/new" className="text-blue hover:underline">
              Create one
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
