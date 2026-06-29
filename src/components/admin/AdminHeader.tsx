interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#0b1220]/50 px-8 py-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      )}
    </header>
  );
}
