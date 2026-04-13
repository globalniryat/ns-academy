"use client";

import React, { useState } from "react";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Admin {
  id: string;
  name: string | null;
  email: string;
}

export default function PromoteAdminForm({ initialAdmins }: { initialAdmins: Admin[] }) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await fetch("/api/admin/settings/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setAdmins((prev) => {
        if (prev.find((a) => a.id === data.data.id)) return prev;
        return [...prev, data.data];
      });
      setSuccess(`${data.data.name ?? data.data.email} is now an admin.`);
      setEmail("");
      setTimeout(() => setSuccess(""), 5000);
    } else {
      setError(data.error || "Failed to promote user.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Admin list */}
      <div className="space-y-2">
        {admins.map((a) => (
          <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-blue">
                {a.name?.charAt(0)?.toUpperCase() ?? a.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-navy">{a.name ?? "—"}</p>
              <p className="text-xs text-muted">{a.email}</p>
            </div>
            <span className="ml-auto text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
              ADMIN
            </span>
          </div>
        ))}
      </div>

      {/* Promote form */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Grant Admin Access</p>
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 mb-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
          />
          <Button
            type="submit"
            variant="default"
            size="sm"
            loading={loading}
            loadingText="Promoting…"
            disabled={loading || !email.trim()}
            className="gap-1.5 h-10 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Promote
          </Button>
        </form>
        <p className="text-xs text-muted mt-2">The user must already have an account on the platform.</p>
      </div>
    </div>
  );
}
