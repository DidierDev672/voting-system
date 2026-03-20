'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';
import { MunicipalCouncilSession } from '@/app/core/domain/types/municipal-council-session';
import { DjangoMunicipalCouncilSessionRepository } from '@/app/core/infrastructure/adapters/django-municipal-council-session.repository';

const sessionRepository = new DjangoMunicipalCouncilSessionRepository();

export default function ActasListPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<MunicipalCouncilSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<MunicipalCouncilSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    loadSessions();
  }, []);

  useEffect(() => {
    let filtered = sessions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.statusSession === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.titleSession.toLowerCase().includes(term) ||
        s.municipio?.toLowerCase().includes(term) ||
        s.typeSession.toLowerCase().includes(term)
      );
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionRepository.getAll();
      setSessions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar sesiones';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Convocada':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Convocada</span>;
      case 'En progreso':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En Progreso</span>;
      case 'Realizada':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Realizada</span>;
      case 'Cancelada':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelada</span>;
      case 'Postergada':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Postergada</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Ordinaria':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">Ordinaria</span>;
      case 'Extraordinaria':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">Extraordinaria</span>;
      case 'Especial':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Especial</span>;
      case 'Instalacion':
        return <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Instalación</span>;
      default:
        return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">{type}</span>;
    }
  };

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#3d2f1f]">Actas de Sesiones</h1>
          <p className="text-[#8b7355] mt-1">Visualice y genere actas de las sesiones del Consejo Municipal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por título o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white border border-[#d4c5b0] rounded-lg text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b8a896]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
          >
            <option value="all">Todos los estados</option>
            <option value="Convocada">Convocada</option>
            <option value="En progreso">En Progreso</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Postergada">Postergada</option>
          </select>

          <div className="bg-white border border-[#d4c5b0] rounded-lg p-4 flex items-center justify-center">
            <p className="text-[#8b7355] text-sm">
              <span className="font-bold text-[#3d2f1f]">{filteredSessions.length}</span> actas disponibles
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 border border-[#d4c5b0] text-center">
            <p className="text-[#8b7355] mb-4">No hay sesiones registradas para generar actas</p>
            <button
              onClick={() => router.push('/session')}
              className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
            >
              Crear primera sesión
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div 
                key={session.id} 
                className="bg-white rounded-lg shadow-lg border border-[#d4c5b0] overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/actas/${session.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {getTypeBadge(session.typeSession)}
                    {getStatusBadge(session.statusSession)}
                  </div>

                  <h3 className="text-lg font-medium text-[#3d2f1f] mb-3 line-clamp-2">
                    {session.titleSession}
                  </h3>

                  <div className="space-y-2 text-sm text-[#8b7355]">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(session.dateHourStart).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(session.dateHourStart).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="truncate">{session.placeEnclosure}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#e5ddd0] flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-[#8b7355]">
                      <span className="bg-[#f5f1eb] px-2 py-1 rounded">
                        {session.members.length} miembros
                      </span>
                      <span className="bg-[#f5f1eb] px-2 py-1 rounded">
                        {session.bancadas.length} bancadas
                      </span>
                    </div>
                    <span className="text-[#3d2f1f] text-sm font-medium flex items-center gap-1">
                      Ver acta
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
