"use client";

import { usePathname } from "next/navigation";

interface ConditionalChromeProps {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function ConditionalChrome({ navbar, footer, children }: ConditionalChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex flex-1 flex-col">{children}</main>
      {footer}
    </>
  );
}
