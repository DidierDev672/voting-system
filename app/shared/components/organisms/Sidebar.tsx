import { Logo } from "../atoms/Logo";
import Link from "next/link";
import { ReactNode } from "react";

export function Sidebar({ children }: { children?: ReactNode }) {
  const navLinks = [
    { href: "/dashboard", label: "Panel Principal", icon: "📊" },
    { href: "/partidos", label: "Partidos Políticos", icon: "🏛️" },
    { href: "/Miembros", label: "Miembros", icon: "👥" },
    { href: "/consulta", label: "Votaciones", icon: "🗳️" },
    { href: "/resultados", label: "Resultados", icon: "📈" },
    { href: "/configuracion", label: "Configuración", icon: "⚙️" },
  ];
  return (
    <aside className="w-64 bg-[#f5f1eb] border-r border-[#e5ddd0] flex flex-col min-h-screen">
      <Logo />
      {children}
      {/* Navigation */}
      <nav className="mt-8 px-4 flex-1">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center px-4 py-3 rounded-sm text-sm font-light tracking-wide text-[#8b7355] hover:bg-[#faf8f5] hover:text-[#3d2f1f] transition-all duration-300 group"
              >
                <span className="mr-3 text-[#b8a896] group-hover:text-[#8b7355] transition-colors">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="mt-auto p-6 border-t border-[#e5ddd0]">
        <p className="text-xs text-[#b8a896] font-light text-center">
          Sistema Electoral
        </p>
        <p className="text-[10px] text-[#d4c5b0] font-light text-center mt-1">
          Democracia Participativa
        </p>
      </div>
      {children}
    </aside>
  );
}
