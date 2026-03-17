"use client";

import { useState } from "react";
import { Logo } from "../atoms/Logo";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { href: "/dashboard", label: "Panel Principal", icon: "📊" },
    { href: "/partidos", label: "Registrar Partido", icon: "🏛️" },
    { href: "/partidos/list", label: "Lista Partidos", icon: "📋" },
    { href: "/Miembros", label: "Registrar Miembro", icon: "👤" },
    { href: "/Miembros/list", label: "Lista Miembros", icon: "👥" },
    { href: "/political_consultation", label: "Crear Consulta", icon: "📝" },
    { href: "/consultation/list", label: "Lista Consultas", icon: "🗳️" },
    { href: "/votos/list", label: "Votos", icon: "🗳️" },
    { href: "/president", label: "Presidente Consejo", icon: "🏅" },
    { href: "/secretary", label: "Secretario Consejo", icon: "📜" },
    { href: "/session", label: "Crear Sesion", icon: "📅" },
    { href: "/session-calendar", label: "Calendario Sesiones", icon: "📆" },
    { href: "/resultados", label: "Resultados", icon: "📈" },
    { href: "/configuracion", label: "Configuracion", icon: "⚙️" },
  ];

  return (
    <>
      {/* Botón hamburguesa - solo visible en móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#3d2f1f] text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay oscuro - solo en móvil */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-[#f5f1eb] border-r border-[#e5ddd0] 
        flex-col min-h-screen
        fixed md:sticky top-0 left-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <Logo />
        
        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-sm text-sm font-light tracking-wide text-[#8b7355] hover:bg-[#faf8f5] hover:text-[#3d2f1f] transition-all duration-300 group"
                >
                  <span className="mr-3 text-[#b8a896] group-hover:text-[#8b7355] transition-colors">
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-6 border-t border-[#e5ddd0]">
          <p className="text-xs text-[#b8a896] font-light text-center">
            Sistema Electoral
          </p>
          <p className="text-[10px] text-[#d4c5b0] font-light text-center mt-1">
            Democracia Participativa
          </p>
        </div>
      </aside>
    </>
  );
}
