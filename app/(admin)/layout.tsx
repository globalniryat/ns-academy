import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavProgress from "@/components/admin/AdminNavProgress";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    isAdmin = profile?.role === "ADMIN";
  }

  // Render sidebar only for authenticated admins
  // (middleware already handles redirects; this is a display-layer guard)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">{children}</div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavProgress />
      <AdminSidebar />
      <main className="flex-1 overflow-auto lg:pt-0 pt-14">{children}</main>
    </div>
  );
}
