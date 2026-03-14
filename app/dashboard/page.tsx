'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/core/presentation/hooks/use-auth';
import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f] mx-auto"></div>
          <p className="mt-4 text-[#8b7355]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light text-[#3d2f1f]">
            Panel Principal
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-[#8b7355] hover:bg-[#6b5744] text-white rounded-md text-sm transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <p className="text-[#8b7355] mb-4">
          Bienvenido{user?.fullName ? `, ${user.fullName}` : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-sm border border-[#e5ddd0]">
            <h3 className="text-lg font-medium text-[#3d2f1f] mb-2">
              Consultas Populares
            </h3>
            <p className="text-3xl font-light text-[#8b7355]">0</p>
          </div>
          <div className="bg-white p-6 rounded-sm border border-[#e5ddd0]">
            <h3 className="text-lg font-medium text-[#3d2f1f] mb-2">
              Votaciones Activas
            </h3>
            <p className="text-3xl font-light text-[#8b7355]">0</p>
          </div>
          <div className="bg-white p-6 rounded-sm border border-[#e5ddd0]">
            <h3 className="text-lg font-medium text-[#3d2f1f] mb-2">
              Tus Votos
            </h3>
            <p className="text-3xl font-light text-[#8b7355]">0</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
