import AdminSidebar from "./admin-sidebar";
import AdminHeader from "./admin-header";

export default function AdminLayoutUI({
  children,
  admin,
}: any) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader admin={admin} />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}