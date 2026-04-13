import { createClient } from '@supabase/supabase-js'

// Admin client uses service_role key — bypasses RLS
// ONLY use server-side (API routes, seed scripts). Never expose to client.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
