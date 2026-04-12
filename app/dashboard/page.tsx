"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  PlayCircle,
  Trophy,
  ChevronRight,
  TrendingUp,
  Clock,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/lib/auth";
import { courses } from "@/lib/courses";

type LevelVariant = "foundation" | "intermediate" | "final";
const levelVariantMap: Record<string, LevelVariant> = {
  Foundation: "foundation",
  Intermediate: "intermediate",
  Final: "final",
};

function DashboardInner() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const enrolledCourses = courses.filter((c) => user?.enrolled.includes(c.id));
  const exploreMore = courses.filter((c) => !user?.enrolled.includes(c.id));

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-offwhite pt-16">
      {/* Header */}
      <div className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  Welcome back
                </p>
                <h1 className="font-heading text-2xl font-bold text-white mt-0.5">
                  {user?.name}
                </h1>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white/60 hover:text-white hover:bg-white/10 gap-2 self-start sm:self-auto"
              id="dashboard-logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { icon: BookOpen, label: "Courses Enrolled", value: enrolledCourses.length },
              { icon: PlayCircle, label: "Lessons Completed", value: 4 },
              { icon: TrendingUp, label: "Overall Progress", value: "30%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-10 h-10 bg-blue/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-blue" />
                </div>
                <div className="text-2xl md:text-3xl font-heading font-bold text-navy">{stat.value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
        {/* My Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-navy flex items-center gap-2">
              <span className="w-1 h-6 bg-blue rounded-full inline-block" />
              My Courses
            </h2>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted mb-4">You haven&apos;t enrolled in any course yet.</p>
              <Link href="/courses">
                <Button variant="default">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  {/* Thumbnail strip */}
                  <div
                    className="h-3 w-full"
                    style={{ background: course.color }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${course.color}20`,
                          color: course.color,
                        }}
                      >
                        <PlayCircle className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Badge
                          variant={levelVariantMap[course.level] || "foundation"}
                          className="mb-2"
                        >
                          {course.level}
                        </Badge>
                        <h3 className="font-bold text-navy text-sm leading-tight mb-1 line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </span>
                          <span>{course.videoCount} videos</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="text-muted">Progress</span>
                        <span className="text-blue font-semibold">30% complete</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "30%" }} />
                      </div>
                      <p className="text-xs text-muted mt-1.5">4 of {course.videoCount} lessons</p>
                    </div>

                    <Link href={`/dashboard/${course.id}`} className="block mt-4">
                      <Button
                        variant="default"
                        className="w-full gap-2"
                        id={`continue-${course.id}`}
                      >
                        <PlayCircle className="w-4 h-4" />
                        Continue Learning
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Explore More */}
        {exploreMore.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-navy text-xl">
                Explore More Courses
              </h2>
              <Link href="/courses">
                <button className="text-blue text-sm font-medium hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {exploreMore.map((course) => (
                <Card key={course.id} className="overflow-hidden card-hover">
                  <div className="h-3 w-full" style={{ background: course.color }} />
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${course.color}20`, color: course.color }}
                      >
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge
                          variant={levelVariantMap[course.level] || "foundation"}
                          className="mb-2"
                        >
                          {course.level}
                        </Badge>
                        <h3 className="font-bold text-navy text-sm leading-tight mb-1 line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-navy font-bold">
                            ₹{course.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted line-through">
                            ₹{course.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/checkout/${course.id}`}>
                      <Button variant="outline" className="w-full" id={`explore-${course.id}`}>
                        Enroll Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardInner />
    </AuthGuard>
  );
}
