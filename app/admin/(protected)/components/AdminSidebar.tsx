// app/admin/(protected)/components/AdminSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const nav = [
    { name: "Overview", href: "/admin", roles: ["SUPER", "OPS", "SUPPORT"] },
    { name: "Orders", href: "/admin/orders", roles: ["SUPER", "OPS", "SUPPORT"] },
    { name: "Pricing", href: "/admin/pricing", roles: ["SUPER", "OPS"] },
    { name: "Invoices", href: "/admin/invoices", roles: ["SUPER", "OPS"] },
    { name: "Analytics", href: "/admin/analytics", roles: ["SUPER"] },
    { name: "Admins", href: "/admin/admins", roles: ["SUPER"] },
  ];

  const visibleNav = nav.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen">
      <div className="p-6 text-lg font-semibold">BlueSky Admin</div>

      <nav className="space-y-1 px-3">
        {visibleNav.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-md text-sm transition
              ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}