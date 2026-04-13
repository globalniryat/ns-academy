import { Users, BookOpen, CreditCard, GraduationCap, IndianRupee, ArrowRight, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge, { toVariant } from "@/components/admin/StatusBadge";
import Link from "next/link";

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalStudents,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    revenueAgg,
    recentEnrollments,
    last7DaysPayments,
    topCourses,
  ] = await Promise.all([
    prisma.profile.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.enrollment.count({ where: { status: { in: ["ACTIVE", "COMPLETED"] } } }),
    prisma.payment.aggregate({ where: { status: "CAPTURED" }, _sum: { amount: true } }),
    prisma.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      take: 6,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.payment.findMany({
      where: { status: "CAPTURED", createdAt: { gte: sevenDaysAgo } },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.course.findMany({
      orderBy: { sortOrder: "asc" },
      take: 5,
      include: { _count: { select: { enrollments: true } } },
    }),
  ]);

  // Revenue per course
  const courseRevenue = await prisma.payment.groupBy({
    by: ["courseId"],
    where: { status: "CAPTURED" },
    _sum: { amount: true },
  });
  const revenueMap = Object.fromEntries(
    courseRevenue.map((r) => [r.courseId, r._sum.amount ?? 0])
  );

  const totalRevenue = Math.round((revenueAgg._sum.amount ?? 0) / 100);

  // Build 7-day buckets
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const dayRevenue = days.map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const total = last7DaysPayments
      .filter((p) => {
        const pd = new Date(p.createdAt);
        return pd >= day && pd < next;
      })
      .reduce((s, p) => s + p.amount, 0);
    return { day, label: day.toLocaleDateString("en-IN", { weekday: "short" }), amount: total };
  });

  const maxDayRevenue = Math.max(...dayRevenue.map((d) => d.amount), 1);

  const topCoursesSorted = [...topCourses].sort(
    (a, b) => b._count.enrollments - a._count.enrollments
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Welcome back, Admin.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="hidden sm:flex items-center gap-2 bg-navy text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-navy/90 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard icon={Users} label="Total Students" value={totalStudents} sub="registered accounts" color="text-blue" bg="bg-blue/10" />
        <StatsCard icon={BookOpen} label="Courses" value={totalCourses} sub={`${publishedCourses} published`} color="text-teal" bg="bg-teal/10" />
        <StatsCard icon={GraduationCap} label="Enrollments" value={totalEnrollments} sub="active & completed" color="text-purple-600" bg="bg-purple-100" />
        <StatsCard icon={IndianRupee} label="Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="from captured payments" color="text-green-600" bg="bg-green-100" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/courses/new", label: "Add Course", icon: BookOpen },
          { href: "/admin/students", label: "View Students", icon: Users },
          { href: "/admin/payments", label: "Payments", icon: CreditCard },
          { href: "/admin/enrollments", label: "Enrollments", icon: GraduationCap },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 hover:border-blue/30 hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-blue/10 transition-colors">
              <a.icon className="w-4 h-4 text-muted group-hover:text-blue transition-colors" />
            </div>
            <span className="text-sm font-medium text-navy">{a.label}</span>
            <ArrowRight className="w-3.5 h-3.5 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Revenue trend + Course performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue trend — last 7 days */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-navy">Revenue (7 days)</h2>
              <p className="text-xs text-muted mt-0.5">Captured payments only</p>
            </div>
            <TrendingUp className="w-5 h-5 text-muted" />
          </div>
          <div className="flex items-end gap-2 h-32">
            {dayRevenue.map((d, i) => {
              const heightPct = Math.round((d.amount / maxDayRevenue) * 100);
              const isToday = i === 6;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full flex items-end justify-center" style={{ height: "96px" }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${isToday ? "bg-blue" : "bg-blue/20 group-hover:bg-blue/40"}`}
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                      title={`₹${Math.round(d.amount / 100).toLocaleString("en-IN")}`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${isToday ? "text-navy" : "text-muted"}`}>
                    {d.label}
                  </span>
                  {d.amount > 0 && (
                    <span className="text-xs text-muted hidden group-hover:block absolute -mt-8 bg-navy text-white px-2 py-1 rounded-lg pointer-events-none z-10 whitespace-nowrap">
                      ₹{Math.round(d.amount / 100).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted text-center mt-2">
            Total:{" "}
            <span className="font-semibold text-navy">
              ₹{Math.round(dayRevenue.reduce((s, d) => s + d.amount, 0) / 100).toLocaleString("en-IN")}
            </span>{" "}
            this week
          </p>
        </div>

        {/* Course performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-navy">Top Courses</h2>
              <p className="text-xs text-muted mt-0.5">By enrollment count</p>
            </div>
            <Link href="/admin/courses" className="text-xs text-blue hover:text-blue/80 flex items-center gap-1">
              All courses <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {topCoursesSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted">
              <BookOpen className="w-8 h-8 opacity-30 mb-2" />
              <p className="text-sm">No courses yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCoursesSorted.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${c.color}20` }}
                  >
                    <BookOpen className="w-4 h-4" style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy line-clamp-1">{c.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted">{c._count.enrollments} enrolled</span>
                      <span className="text-xs text-muted">
                        ₹{Math.round((revenueMap[c.id] ?? 0) / 100).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <StatusBadge variant={toVariant(c.status)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent enrollments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-navy">Recent Enrollments</h2>
          <Link href="/admin/enrollments" className="flex items-center gap-1 text-sm text-blue hover:text-blue/80 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {recentEnrollments.length === 0 ? (
            <div className="text-center py-16 text-muted text-sm">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No enrollments yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50/80">
                    {["Student", "Course", "Date", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentEnrollments.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue">
                              {e.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-navy">{e.user.name}</p>
                            <p className="text-xs text-muted">{e.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-bodytext max-w-[200px]">
                        <p className="line-clamp-1">{e.course.title}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted whitespace-nowrap">
                        {new Date(e.enrolledAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge variant={toVariant(e.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
