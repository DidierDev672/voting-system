export const Footer = () => {
  return (
    <footer className="border-t border-[#e5ddd0] bg-white px-8 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-[#8b7355] font-light">
          &copy; {new Date().getFullYear()} Voting System. All rights reserved.
        </p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <a
            href="/privacidad"
            className="text-xs text-[#b8a896] hover:text-[#8b7355] font-light transition-colors"
          >
            Privacidad
          </a>
          <a
            href="/terminos"
            className="text-xs text-[#b8a896] hover:text-[#8b7355] font-light transition-colors"
          >
            Términos
          </a>
          <a
            href="/ayuda"
            className="text-xs text-[#b8a896] hover:text-[#8b7355] font-light transition-colors"
          >
            Ayuda
          </a>
        </div>
      </div>
    </footer>
  );
};
