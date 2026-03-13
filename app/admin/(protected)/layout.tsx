// app/admin/(protected)/layout.tsx

import { getAdmin } from "@/lib/admin/get-admin";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin } = await getAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar role={admin.admin_role} />

      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}