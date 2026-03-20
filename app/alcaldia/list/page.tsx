'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';
import { GetAllAlcaldiasUseCase, DeleteAlcaldiaUseCase } from '../application/usecases/alcaldia.usecases';
import { DjangoAlcaldiaRepository } from '../infrastructure/adapters/django-alcaldia.repository';
import { Alcaldia } from '../domain/types/alcaldia';

const alcaldiaRepository = new DjangoAlcaldiaRepository();
const getAllAlcaldiasUseCase = new GetAllAlcaldiasUseCase(alcaldiaRepository);
const deleteAlcaldiaUseCase = new DeleteAlcaldiaUseCase(alcaldiaRepository);

export default function AlcaldiasListPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [alcaldias, setAlcaldias] = useState<Alcaldia[]>([]);
  const [filteredAlcaldias, setFilteredAlcaldias] = useState<Alcaldia[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAlcaldia, setExpandedAlcaldia] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    loadAlcaldias();
  }, []);

  useEffect(() => {
    const filtered = alcaldias.filter((alcaldia) => {
      const term = searchTerm.toLowerCase();
      return (
        alcaldia.nombreEntidad.toLowerCase().includes(term) ||
        alcaldia.municipio.toLowerCase().includes(term) ||
        alcaldia.nit.toLowerCase().includes(term) ||
        alcaldia.nombreAlcalde.toLowerCase().includes(term) ||
        alcaldia.ordenEntidad.toLowerCase().includes(term)
      );
    });
    setFilteredAlcaldias(filtered);
  }, [alcaldias, searchTerm]);

  const loadAlcaldias = async () => {
    try {
      setLoading(true);
      const data = await getAllAlcaldiasUseCase.execute();
      setAlcaldias(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar alcaldías';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nombreEntidad: string) => {
    if (!confirm(`¿Está seguro de eliminar la alcaldía "${nombreEntidad}"?`)) return;

    try {
      await deleteAlcaldiaUseCase.execute(id);
      await loadAlcaldias();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar';
      setError(errorMessage);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedAlcaldia(expandedAlcaldia === id ? null : id);
  };

  const getOrdenColor = (orden: string) => {
    switch (orden) {
      case 'Municipal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Distrital': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-light text-[#3d2f1f]">Alcaldías</h1>
            <p className="text-[#8b7355] mt-1">Gestión de alcaldías y entidades territoriales</p>
          </div>
          <button
            onClick={() => router.push('/alcaldia')}
            className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
          >
            + Nueva Alcaldía
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, municipio, NIT, alcalde..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white border border-[#d4c5b0] rounded-lg text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f] focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b8a896]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#b8a896] hover:text-[#3d2f1f]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-[#8b7355]">
              {filteredAlcaldias.length} {filteredAlcaldias.length === 1 ? 'resultado' : 'resultados'} para "{searchTerm}"
            </p>
          )}
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
        ) : filteredAlcaldias.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 border border-[#d4c5b0] text-center">
            {searchTerm ? (
              <>
                <p className="text-[#8b7355] mb-4">No se encontraron alcaldías para "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
                >
                  Limpiar búsqueda
                </button>
              </>
            ) : (
              <>
                <p className="text-[#8b7355] mb-4">No hay alcaldías registradas</p>
                <button
                  onClick={() => router.push('/alcaldia')}
                  className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
                >
                  Crear primera alcaldía
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlcaldias.map((alcaldia) => (
              <div key={alcaldia.id} className="bg-white rounded-lg shadow-lg border border-[#d4c5b0] overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-[#faf8f5] transition-colors"
                  onClick={() => toggleExpand(alcaldia.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-medium text-[#3d2f1f]">{alcaldia.nombreEntidad}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getOrdenColor(alcaldia.ordenEntidad)}`}>
                          {alcaldia.ordenEntidad}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#8b7355]">
                        <div>
                          <span className="font-medium">Municipio:</span> {alcaldia.municipio}
                        </div>
                        <div>
                          <span className="font-medium">NIT:</span> {alcaldia.nit}
                        </div>
                        <div>
                          <span className="font-medium">SIGEP:</span> {alcaldia.codigoSigep}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg 
                        className={`w-6 h-6 text-[#8b7355] transition-transform ${expandedAlcaldia === alcaldia.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedAlcaldia === alcaldia.id && (
                  <div className="border-t border-[#e5ddd0] p-6 bg-[#faf8f5]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-[#3d2f1f]">Información General</h4>
                        <div className="text-sm space-y-2">
                          <p><span className="font-medium text-[#8b7355]">Dominio:</span> {alcaldia.dominio}</p>
                          <p><span className="font-medium text-[#8b7355]">Correo:</span> {alcaldia.correoInstitucional}</p>
                          <p><span className="font-medium text-[#8b7355]">Dirección:</span> {alcaldia.direccionFisica}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-[#3d2f1f]">Información del Alcalde</h4>
                        <div className="text-sm space-y-2">
                          <p><span className="font-medium text-[#8b7355]">Nombre:</span> {alcaldia.nombreAlcalde}</p>
                          <p><span className="font-medium text-[#8b7355]">Acto de Posesión:</span> {alcaldia.actoPosesion}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(alcaldia.id, alcaldia.nombreEntidad); }}
                        className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
