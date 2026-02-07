import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkItemProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
}

export const LinkItem = ({
  href,
  children,
  isActive = false,
}: LinkItemProps) => {
  const activeClasses = isActive
    ? 'bg-[#3d2f1f] text-white shadow-sm'
    : 'text-[#8b7355] hover:bg-[#faf8f5] hover:text-[#3d2f1f]';
  return (
    <Link
      href={href}
      className={`group flex items-center px-4 py-3 rounded-sm text-sm font-light tracking-wide
        transition-all duration-300 ${activeClasses}`}
    >
      {children}
    </Link>
  );
};
