"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/stores", label: "Stores", icon: "🏪" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/listings", label: "Listings", icon: "💰" },
] as const;

export function AdminSidebar() {
  const currentPath = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#0b1220]">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-sm font-bold text-violet-300">
            AD
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-slate-500">Gaming Stores UAE</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? currentPath === "/admin"
              : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-violet-500/15 font-medium text-violet-200"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
