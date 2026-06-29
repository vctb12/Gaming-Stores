import Link from "next/link";

const navLinks = [
  { href: "/products", label: "Compare Products" },
  { href: "/stores", label: "Stores" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  return (
    <header className="border-b border-white/10 bg-[#0b1220]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-bold text-white shadow-lg shadow-cyan-500/20">
            GS
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">
              Gaming Stores
            </p>
            <p className="text-xs text-slate-400">UAE price comparison</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
