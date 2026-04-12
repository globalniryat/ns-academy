import { prisma } from "@/lib/prisma";

const STATUS_STYLES: Record<string, string> = {
  CAPTURED: "bg-green-100 text-green-700",
  CREATED: "bg-yellow-100 text-yellow-700",
  AUTHORIZED: "bg-blue/10 text-blue",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  const totalRevenue = payments
    .filter((p) => p.status === "CAPTURED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Payments</h1>
          <p className="text-muted text-sm mt-1">{payments.length} total transactions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-right">
          <p className="text-xs text-muted uppercase tracking-wider">Total Revenue</p>
          <p className="font-heading text-2xl font-bold text-navy mt-1">
            ₹{Math.round(totalRevenue / 100).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["Student", "Course", "Amount", "Status", "Date", "Order ID"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-navy">{p.user.name}</p>
                    <p className="text-xs text-muted">{p.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-bodytext max-w-[180px] line-clamp-1">{p.course.title}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-navy whitespace-nowrap">
                    ₹{Math.round(p.amount / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted truncate max-w-[120px]">
                    {p.razorpayOrderId ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="py-12 text-center text-sm text-muted">No payments yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
