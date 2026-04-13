import Link from "next/link";
import { Plus, Edit2, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const levelVariantMap: Record<string, "foundation" | "intermediate" | "final"> = {
  FOUNDATION: "foundation",
  INTERMEDIATE: "intermediate",
  FINAL: "final",
};

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-amber-100 text-amber-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { enrollments: true, sections: true } } },
  });

  const published = courses.filter((c) => c.status === "PUBLISHED").length;
  const draft = courses.filter((c) => c.status === "DRAFT").length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Courses</h1>
          <p className="text-muted text-sm mt-1">
            {courses.length} total · {published} published · {draft} draft
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            New Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted" />
          </div>
          <div>
            <p className="font-semibold text-navy">No courses yet</p>
            <p className="text-sm text-muted mt-1">Create your first course to get started.</p>
          </div>
          <Link href="/admin/courses/new">
            <Button variant="default" className="gap-2 mt-2">
              <Plus className="w-4 h-4" />
              Create Course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/80">
                  {["Course", "Level", "Status", "Price", "Enrolled", "Sections", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/40 transition-colors group">
                    {/* Course title + slug */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${course.color}20` }}
                        >
                          <BookOpen className="w-4 h-4" style={{ color: course.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy line-clamp-1 max-w-[200px]">
                            {course.title}
                          </p>
                          <p className="text-xs text-muted font-mono mt-0.5">{course.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="px-5 py-4">
                      <Badge variant={levelVariantMap[course.level] ?? "foundation"}>
                        {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[course.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-navy">
                          ₹{Math.round(course.price / 100).toLocaleString("en-IN")}
                        </p>
                        {course.originalPrice > course.price && (
                          <p className="text-xs text-muted line-through">
                            ₹{Math.round(course.originalPrice / 100).toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Enrollments */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-bodytext font-medium">{course._count.enrollments}</span>
                    </td>

                    {/* Sections */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-bodytext">{course._count.sections}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
