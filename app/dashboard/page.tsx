"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, PlayCircle, Trophy, ChevronRight, TrendingUp,
  Clock, Award, LogOut, User, Download, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type LevelVariant = "foundation" | "intermediate" | "final";
const levelVariantMap: Record<string, LevelVariant> = {
  FOUNDATION: "foundation", INTERMEDIATE: "intermediate", FINAL: "final",
};
const levelLabel: Record<string, string> = {
  FOUNDATION: "Foundation", INTERMEDIATE: "Intermediate", FINAL: "Final",
};

interface Enrollment {
  id: string; status: string; certificateId: string | null;
  course: { id: string; slug: string; title: string; level: string; duration: string; color: string; };
  progress: { completed: number; total: number; percent: number; };
}
interface Certificate {
  id: string; certificateNo: string; issuedAt: string; course: { title: string };
}

const statCards = [
  { label: "Enrolled",      icon: BookOpen,    iconColor: "text-blue-400"    },
  { label: "Completed",     icon: PlayCircle,  iconColor: "text-emerald-400" },
  { label: "In Progress",   icon: TrendingUp,  iconColor: "text-violet-400"  },
  { label: "Certificates",  icon: Award,       iconColor: "text-amber-400"   },
];

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; initials: string } | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/login?redirect=/dashboard"); return; }
      const displayName = authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Student";
      const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
      setUser({ name: displayName, email: authUser.email || "", initials });
      const [enrollRes, certRes] = await Promise.all([fetch("/api/enrollments"), fetch("/api/certificates")]);
      if (enrollRes.ok) { const d = await enrollRes.json(); setEnrollments(d.data || []); }
      if (certRes.ok)   { const d = await certRes.json();  setCertificates(d.data  || []); }
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/"); router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalCompleted   = enrollments.reduce((s, e) => s + e.progress.completed, 0);
  const inProgressCount  = enrollments.filter(e => e.status === "ACTIVE").length;
  const statValues       = [enrollments.length, totalCompleted, inProgressCount, certificates.length];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">

      {/* ── Hero header ── */}
      <div className="relative bg-gradient-to-br from-[#0a1628] via-[#0d2240] to-[#0a1628] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 hero-grid-pattern opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-10">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg text-white font-bold text-lg ring-2 ring-white/20">
                {user?.initials || <User className="w-7 h-7" />}
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-0.5">
                  Welcome back
                </p>
                <h1 className="font-heading text-2xl font-bold text-white">
                  {user?.name}
                </h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors self-start sm:self-auto"
              id="dashboard-logout"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={s.label}
                className="relative rounded-2xl p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                {/* Shine line at top */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <div className="text-3xl font-heading font-bold text-white mb-1">
                  {statValues[i]}
                </div>
                <div className="text-white/50 text-xs font-semibold uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">

        {/* My Courses */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-800">My Courses</h2>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-slate-500 mb-5 font-medium">No courses yet — start your CA journey!</p>
              <Link href="/courses">
                <Button variant="default">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => {
                const isComplete = enrollment.status === "COMPLETED";
                const pct = enrollment.progress.percent;
                return (
                  <div key={enrollment.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Colour bar */}
                    <div className="h-1.5 w-full" style={{ background: enrollment.course.color }} />

                    <div className="p-6">
                      {/* Course header */}
                      <div className="flex items-start gap-4 mb-5">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{ background: `${enrollment.course.color}18`, color: enrollment.course.color }}
                        >
                          {isComplete ? <Trophy className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant={levelVariantMap[enrollment.course.level] || "foundation"} className="mb-1.5">
                            {levelLabel[enrollment.course.level]}
                          </Badge>
                          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                            {enrollment.course.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                            <Clock className="w-3 h-3" /> {enrollment.course.duration}
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-slate-500 font-medium">
                            {enrollment.progress.completed} of {enrollment.progress.total} lessons
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: isComplete ? "#16a34a" : enrollment.course.color }}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: isComplete
                                ? "linear-gradient(90deg,#22c55e,#16a34a)"
                                : `linear-gradient(90deg,${enrollment.course.color}cc,${enrollment.course.color})`,
                            }}
                          />
                        </div>
                        {isComplete && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs text-emerald-600 font-semibold">Course Completed!</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/dashboard/${enrollment.course.id}`} className="flex-1">
                          <Button
                            variant="default"
                            className="w-full gap-2 text-sm h-9"
                            style={!isComplete ? { background: enrollment.course.color, borderColor: enrollment.course.color } : {}}
                          >
                            <PlayCircle className="w-4 h-4" />
                            {isComplete ? "Review Course" : "Continue Learning"}
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          </Button>
                        </Link>
                        {isComplete && enrollment.certificateId && (
                          <Link href={`/api/certificates/${enrollment.certificateId}/download`}>
                            <Button variant="outline" size="sm" className="gap-1.5 h-9 px-3 border-amber-400 text-amber-700 hover:bg-amber-500 hover:text-white hover:border-amber-500">
                              <Award className="w-4 h-4" />
                              Certificate
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="font-heading text-xl font-bold text-slate-800">My Certificates</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id}
                  className="relative bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Background decoration */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-200/30 rounded-full" />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-amber-300/20 rounded-full" />

                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{cert.course.title}</p>
                      <p className="text-xs text-amber-700/70 mt-0.5">
                        {cert.certificateNo} · {new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <Link href={`/api/certificates/${cert.id}/download`}>
                      <Button size="sm" className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
