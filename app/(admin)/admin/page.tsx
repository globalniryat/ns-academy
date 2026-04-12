import { Users, BookOpen, CreditCard, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";

export default async function AdminDashboard() {
  const [
    totalStudents, totalCourses, totalEnrollments,
    revenueAgg, recentEnrollments,
  ] = await Promise.all([
    prisma.profile.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.enrollment.count({ where: { status: { in: ["ACTIVE", "COMPLETED"] } } }),
    prisma.payment.aggregate({ where: { status: "CAPTURED" }, _sum: { amount: true } }),
    prisma.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      take: 8,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
  ]);

  const totalRevenue = Math.round((revenueAgg._sum.amount ?? 0) / 100);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome back, Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard icon={Users} label="Total Students" value={totalStudents} color="text-blue" />
        <StatsCard icon={BookOpen} label="Courses" value={totalCourses} color="text-teal" />
        <StatsCard icon={TrendingUp} label="Enrollments" value={totalEnrollments} color="text-blue" />
        <StatsCard
          icon={CreditCard}
          label="Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          color="text-gold"
        />
      </div>

      {/* Recent enrollments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-navy text-lg">Recent Enrollments</h2>
          <Link href="/admin/students" className="text-sm text-blue hover:underline">
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["Student", "Course", "Date", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {recentEnrollments.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-navy">{e.user.name}</p>
                    <p className="text-xs text-muted">{e.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-bodytext line-clamp-1 max-w-[200px]">
                    {e.course.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                    {new Date(e.enrolledAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                      e.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue/10 text-blue"
                    }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
