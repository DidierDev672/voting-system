import { Logo } from '../atoms/Logo';

export function Sidebar() {
  const navLinks = [
    { href: '/dashboard', label: 'Panel Principal', icon: '📊' },
    { href: '/partidos', label: 'Registrar Partido', icon: '🏛️' },
    { href: '/partidos/list', label: 'Lista Partidos', icon: '📋' },
    { href: '/Miembros', label: 'Registrar Miembro', icon: '👤' },
    { href: '/Miembros/list', label: 'Lista Miembros', icon: '👥' },
    { href: '/political_consultation', label: 'Crear Consulta', icon: '📝' },
    { href: '/consultation/list', label: 'Lista Consultas', icon: '🗳️' },
    { href: '/votos/list', label: 'Votos', icon: '🗳️' },
    { href: '/resultados', label: 'Resultados', icon: '📈' },
    { href: '/configuracion', label: 'Configuración', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-[#f5f1eb] border-r border-[#e5ddd0] flex flex-col min-h-screen">
      <Logo />
      {/* Navigation */}
      <nav className="mt-8 px-4 flex-1">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
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

      {/* Footer del sidebar */}
      <div className="mt-auto p-6 border-t border-[#e5ddd0]">
        <p className="text-xs text-[#b8a896] font-light text-center">
          Sistema Electoral
        </p>
        <p className="text-[10px] text-[#d4c5b0] font-light text-center mt-1">
          Democracia Participativa
        </p>
      </div>
    </aside>
  );
}
