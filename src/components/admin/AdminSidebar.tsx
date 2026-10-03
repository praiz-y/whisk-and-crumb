"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tags, Package, Image as ImageIcon, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/logout/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", Icon: Tags },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/gallery", label: "Gallery", Icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex h-full flex-col gap-1 p-4">
      <p className="px-2 pb-3 font-display text-lg font-medium text-dark-text">Admin</p>
      {navItems.map(({ href, label, Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              active ? "bg-caramel/15 text-dark-text" : "text-brown hover:bg-cream-dark"
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        );
      })}
      <form action={logoutAction} className="mt-auto">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brown transition-colors duration-200 hover:bg-cream-dark"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Logout
        </button>
      </form>
    </nav>
  );
}
