// app/admin/(protected)/components/AdminHeader.tsx

"use client";

import { supabaseAnon } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await supabaseAnon.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
      <div className="text-sm text-muted-foreground">
        Admin Control Panel
      </div>

      <button
        onClick={handleLogout}
        className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
      >
        Logout
      </button>
    </header>
  );
}