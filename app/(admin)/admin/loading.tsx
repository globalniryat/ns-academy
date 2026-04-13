/**
 * Admin route loading state — shown automatically by Next.js App Router
 * as a Suspense boundary while any admin page's server data is fetching.
 * Covers: /admin, /admin/courses, /admin/students, /admin/payments, etc.
 */
export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      {/* Spinner ring */}
      <div className="relative w-11 h-11">
        {/* Track */}
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
        {/* Spinning arc */}
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-green-500"
          style={{ animation: "spin 0.75s linear infinite" }}
        />
      </div>
      <p className="text-sm text-gray-400 font-medium tracking-wide">Loading…</p>
    </div>
  );
}
