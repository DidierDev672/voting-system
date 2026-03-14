'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Verificar si existe sesión en localStorage
    const session = localStorage.getItem('auth_session');

    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [mounted, router]);

  // Evitar discrepancia SSR/client
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f] mx-auto"></div>
          <p className="mt-4 text-[#8b7355]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f] mx-auto"></div>
        <p className="mt-4 text-[#8b7355]">Cargando...</p>
      </div>
    </div>
  );
}
