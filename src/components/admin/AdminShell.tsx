"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {isDesktop ? (
        <aside className="w-60 shrink-0 border-r border-border bg-cream-dark/40">
          <AdminSidebar />
        </aside>
      ) : (
        <>
          <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-cream px-4">
            <span className="font-display text-base font-medium text-dark-text">Admin</span>
            <button
              type="button"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((open) => !open)}
              className="inline-flex size-10 items-center justify-center rounded-lg text-brown hover:bg-cream-dark"
            >
              {mobileNavOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </header>
          {mobileNavOpen ? (
            <div className="fixed inset-0 top-14 z-30 bg-cream" onClick={() => setMobileNavOpen(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
              </div>
            </div>
          ) : null}
        </>
      )}
      <main className={isDesktop ? "flex-1 p-8" : "flex-1 p-4 pt-[4.5rem]"}>{children}</main>
    </div>
  );
}
