import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <div className="p-6 border-b border-[#e5ddd0]">
      <div className="flex items-center space-x-3">
        {/* Icono de urna o badge institucional  */}
        <div className="w-10 h-10 bg-[#3d2f1f] rounded-sm flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[#f5f1eb]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-[#3d2f1f] font-medium text-lg tracking-wide">
            VotoDigital
          </h1>
          <p className="text-[#8b7355] text-xs font-light">
            Registro Electoral
          </p>
        </div>
      </div>
    </div>
  );
};
