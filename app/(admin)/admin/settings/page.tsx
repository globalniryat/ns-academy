import { ShieldCheck, Key, Mail } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Settings</h1>
        <p className="text-muted text-sm mt-1">Platform configuration.</p>
      </div>

      {/* Payment settings info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-heading font-bold text-navy flex items-center gap-2">
          <Key className="w-4 h-4" />
          Razorpay Configuration
        </h2>
        <div className="space-y-3 text-sm text-bodytext">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-navy">RAZORPAY_KEY_ID</p>
              <p className="text-muted text-xs">Set in <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">.env.local</code> — not editable here for security.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-navy">RAZORPAY_KEY_SECRET</p>
              <p className="text-muted text-xs">Set in <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">.env.local</code> — never exposed to the client.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin bootstrap info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-heading font-bold text-navy flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Admin Account
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          To grant admin access to a new user, run this SQL in Supabase Dashboard:
        </p>
        <pre className="bg-gray-900 text-green-400 text-xs font-mono rounded-xl p-4 overflow-x-auto leading-relaxed">
{`UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data
  || '{"role":"ADMIN"}'::jsonb
WHERE email = 'newadmin@example.com';

UPDATE public."Profile"
SET role = 'ADMIN'
WHERE email = 'newadmin@example.com';`}
        </pre>
      </div>

      {/* DB Trigger info */}
      <div className="bg-blue/5 border border-blue/20 rounded-2xl p-6">
        <h2 className="font-heading font-bold text-navy text-sm mb-2">Auto-create Profile on Signup</h2>
        <p className="text-xs text-muted leading-relaxed">
          Ensure this trigger is active in Supabase SQL Editor:
          <code className="block font-mono bg-white border border-gray-200 rounded-lg p-3 mt-2 text-xs text-navy whitespace-pre-wrap">{`CREATE OR REPLACE FUNCTION public.handle_new_user()
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`}</code>
        </p>
      </div>
    </div>
  );
}
