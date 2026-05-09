"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon, FileTextIcon, DollarSignIcon, BarChartIcon, UsersIcon, TerminalIcon, UserIcon } from "lucide-react"

const rawNavItems = [
  { name: "Overview", href: "/admin", icon: TerminalSquareIcon, roles: ["SUPER", "OPS", "SUPPORT"] },
  { name: "Orders", href: "/admin/orders", icon: FileTextIcon, roles: ["SUPER", "OPS", "SUPPORT"] },
  { name: "Customers", href: "/admin/customers", icon: UsersIcon, roles: ["SUPER", "OPS", "SUPPORT"] },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSignIcon, roles: ["SUPER", "OPS"] },
  { name: "Invoices", href: "/admin/invoices", icon: FileTextIcon, roles: ["SUPER", "OPS"] },
  { name: "Analytics", href: "/admin/analytics", icon: BarChartIcon, roles: ["SUPER"] },
  { name: "Admins", href: "/admin/admins", icon: UsersIcon, roles: ["SUPER"] },
]

export function AppSidebar({ role = "SUPER", ...props }: React.ComponentProps<typeof Sidebar> & { role?: string }) {
  const pathname = usePathname()

  const visibleNav = rawNavItems
    .filter((item) => item.roles.includes(role))
    .map((item) => {
      const Icon = item.icon
      return {
        title: item.name,
        url: item.href,
        icon: <Icon />,
        isActive: pathname === item.href,
      }
    })

  const user = {
    name: role === "SUPER" ? "Super Admin" : "Admin User",
    email: "admin@bluesky.com",
    avatar: "",
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">BlueSky Disposal</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
