import {
  ShieldCheck,
  Key,
  Database,
  Package,
  CheckCircle2,
  XCircle,
  Users,
  ChevronDown,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import PromoteAdminForm from "@/components/admin/PromoteAdminForm";

// Read package.json version at build time
import pkg from "../../../../package.json";

async function checkDb(): Promise<boolean> {
  try {
    await prisma.profile.count();
    return true;
  } catch {
    return false;
  }
}

export default async function AdminSettingsPage() {
  const [dbOk, admins] = await Promise.all([
    checkDb(),
    prisma.profile.findMany({
      where: { role: "ADMIN" },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const envVars = [
    { key: "RAZORPAY_KEY_ID", present: !!process.env.RAZORPAY_KEY_ID },
    { key: "RAZORPAY_KEY_SECRET", present: !!process.env.RAZORPAY_KEY_SECRET },
    { key: "NEXT_PUBLIC_SUPABASE_URL", present: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", present: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { key: "SUPABASE_SERVICE_ROLE_KEY", present: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    { key: "DATABASE_URL", present: !!process.env.DATABASE_URL },
  ];

  const serializedAdmins = admins.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
  }));

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Settings</h1>
        <p className="text-muted text-sm mt-1">Platform configuration and system status.</p>
      </div>

      {/* ── System Status ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-heading font-bold text-navy flex items-center gap-2">
          <Database className="w-4 h-4 text-muted" />
          System Status
        </h2>

        {/* DB */}
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-navy">Database</p>
            <p className="text-xs text-muted">Prisma → Supabase PostgreSQL</p>
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${dbOk ? "text-green-600" : "text-red-500"}`}>
            {dbOk ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {dbOk ? "Connected" : "Unreachable"}
          </div>
        </div>

        {/* App version */}
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p className="text-sm font-medium text-navy">App Version</p>
            <p className="text-xs text-muted">From package.json</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-muted" />
            <span className="text-sm font-mono font-semibold text-navy">v{pkg.version}</span>
          </div>
        </div>

        {/* Env vars */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Environment Variables</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {envVars.map((v) => (
              <div key={v.key} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50">
                {v.present ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                )}
                <span className="text-xs font-mono text-navy truncate">{v.key}</span>
                <span className={`ml-auto text-xs font-medium shrink-0 ${v.present ? "text-green-600" : "text-red-500"}`}>
                  {v.present ? "Set" : "Missing"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Admin Users ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-heading font-bold text-navy flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-muted" />
          Admin Users ({admins.length})
        </h2>
        <PromoteAdminForm initialAdmins={serializedAdmins} />
      </div>

      {/* ── Razorpay Config (collapsible) ─────────────────────── */}
      <details className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
        <summary className="flex items-center justify-between p-6 cursor-pointer select-none list-none">
          <h2 className="font-heading font-bold text-navy flex items-center gap-2">
            <Key className="w-4 h-4 text-muted" />
            Razorpay Configuration
          </h2>
          <ChevronDown className="w-4 h-4 text-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-6 pb-6 space-y-3 text-sm text-bodytext border-t border-gray-100 pt-5">
          {[
            { key: "RAZORPAY_KEY_ID", note: "Public key — used client-side for checkout initialization." },
            { key: "RAZORPAY_KEY_SECRET", note: "Secret key — never exposed to the client." },
          ].map((v) => (
            <div key={v.key} className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-navy">{v.key}</p>
                <p className="text-muted text-xs">
                  Set in <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">.env.local</code> — {v.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </details>

      {/* ── DB Trigger (collapsible) ──────────────────────────── */}
      <details className="bg-blue/5 border border-blue/20 rounded-2xl group">
        <summary className="flex items-center justify-between p-6 cursor-pointer select-none list-none">
          <h2 className="font-heading font-bold text-navy text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-blue" />
            Auto-create Profile on Signup (Supabase Trigger)
          </h2>
          <ChevronDown className="w-4 h-4 text-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-6 pb-6 space-y-3 border-t border-blue/20 pt-5">
          <p className="text-xs text-muted leading-relaxed">
            Ensure this trigger is active in the Supabase SQL Editor to auto-create a Profile record on every new signup:
          </p>
          <pre className="bg-gray-900 text-green-400 text-xs font-mono rounded-xl p-4 overflow-x-auto leading-relaxed">
{`CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."Profile" (id, name, email, role, "isActive", "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.email, 'STUDENT', true, NOW(), NOW()
  );
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`}
          </pre>
          <div className="pt-2">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">To grant admin via SQL</p>
            <pre className="bg-gray-900 text-green-400 text-xs font-mono rounded-xl p-4 overflow-x-auto leading-relaxed">
{`UPDATE public."Profile"
SET role = 'ADMIN'
WHERE email = 'newadmin@example.com';`}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}
