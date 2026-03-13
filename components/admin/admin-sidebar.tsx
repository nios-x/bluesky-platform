import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Admin</h2>

      <nav className="space-y-4">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/pricing">Pricing</Link>
        <Link href="/admin/invoices">Invoices</Link>
        <Link href="/admin/analytics">Analytics</Link>
        <Link href="/admin/admins">Admins</Link>
      </nav>
    </aside>
  );
}