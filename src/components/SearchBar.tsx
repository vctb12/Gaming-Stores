import Link from "next/link";

interface SearchBarProps {
  action?: string;
  defaultValue?: string;
  placeholder?: string;
}

export function SearchBar({
  action = "/products",
  defaultValue = "",
  placeholder = "Search RTX 5080, PS5 Pro, gaming gear...",
}: SearchBarProps) {
  return (
    <form action={action} method="get" className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
        />
        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
        >
          Compare prices
        </button>
      </div>
    </form>
  );
}

export function SearchBarLink() {
  return (
    <Link
      href="/products"
      className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
    >
      Browse all products
    </Link>
  );
}
