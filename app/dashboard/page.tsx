'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/core/presentation/hooks/use-auth';
import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';
import { WelcomeBanner } from '@/app/shared/components/organisms/WelcomeBanner';
import { MunicipalCouncilSession } from '@/app/core/domain/types/municipal-council-session';
import { DjangoMunicipalCouncilSessionRepository } from '@/app/core/infrastructure/adapters/django-municipal-council-session.repository';

const sessionRepository = new DjangoMunicipalCouncilSessionRepository();

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [convocadasSessions, setConvocadasSessions] = useState<MunicipalCouncilSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadConvocadasSessions();
    }
  }, [isAuthenticated]);

  const loadConvocadasSessions = async () => {
    try {
      setLoadingSessions(true);
      const allSessions = await sessionRepository.getAll();
      const convocadas = allSessions.filter(s => s.statusSession === 'Convocada');
      setConvocadasSessions(convocadas);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Ordinaria": return "bg-green-100 text-green-800 border-green-200";
      case "Extraordinaria": return "bg-red-100 text-red-800 border-red-200";
      case "Especial": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Instalacion": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
      <div className="max-w-7xl mx-auto space-y-8">
        <WelcomeBanner userName={user?.fullName} />

        <div className="flex justify-end">
          <button
            onClick={logout}
            className="px-4 py-2 bg-[#8b7355] hover:bg-[#6b5744] text-white rounded-md text-sm transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-[#d4c5b0]">
          <div className="p-6 border-b border-[#e5ddd0]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-medium text-[#3d2f1f]">Sesiones Convocadas</h2>
                <p className="text-sm text-[#8b7355] mt-1">Sesiones pendientes por iniciar</p>
              </div>
              <button
                onClick={() => router.push('/session/list')}
                className="text-sm text-[#8b7355] hover:text-[#3d2f1f] underline"
              >
                Ver todas
              </button>
            </div>
          </div>

          <div className="p-6">
            {loadingSessions ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2f1f]"></div>
              </div>
            ) : convocadasSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#8b7355]">No hay sesiones convocadas</p>
                <button
                  onClick={() => router.push('/session')}
                  className="mt-4 px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors text-sm"
                >
                  Crear Nueva Sesión
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {convocadasSessions.slice(0, 6).map((session) => (
                  <div 
                    key={session.id} 
                    className="p-4 border border-[#e5ddd0] rounded-lg hover:bg-[#faf8f5] transition-colors cursor-pointer"
                    onClick={() => router.push(`/session/${session.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(session.typeSession)}`}>
                        {session.typeSession}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        Convocada
                      </span>
                    </div>
                    <h3 className="font-medium text-[#3d2f1f] mb-2 line-clamp-2">
                      {session.titleSession}
                    </h3>
                    <div className="text-sm text-[#8b7355] space-y-1">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(session.dateHourStart).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(session.dateHourStart).toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {session.placeEnclosure}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-[#8b7355]">
                      <span className="bg-[#f5f1eb] px-2 py-1 rounded">
                        {session.members.length} miembros
                      </span>
                      <span className="bg-[#f5f1eb] px-2 py-1 rounded">
                        {session.bancadas.length} bancadas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
