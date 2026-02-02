import { LinkItem } from "../atoms/LinkItem";

interface SidebarNavProps {
  links: { href: string; label: string; icon?: React.ReactNode }[];
  currentPath: string;
}

export const SidebarNav = ({ links, currentPath }: SidebarNavProps) => {
  return (
    <nav className="mt-12 px-4">
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <LinkItem href={link.href} isActive={currentPath === link.href}>
              {link.icon && (
                <span className="mr-3 text-[#b8a896] group-hover:text-[#8b7355] transition-colors">
                  {link.icon}
                </span>
              )}
              {link.label}
            </LinkItem>
          </li>
        ))}
      </ul>
    </nav>
  );
};
