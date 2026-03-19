"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MunicipalCouncilSession, SessionMember, SessionBancada } from "@/app/core/domain/types/municipal-council-session";
import { DjangoMunicipalCouncilSessionRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-session.repository";
import { logger } from "@/app/core/infrastructure/logger/logger";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";

const sessionRepository = new DjangoMunicipalCouncilSessionRepository();

interface AvailableMember {
  id: string;
  fullName: string;
  documentNumber: string;
}

interface AvailableBancada {
  id: string;
  tipoCurul: string;
  profesion: string;
}

export default function SessionsListPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<MunicipalCouncilSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<MunicipalCouncilSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [addingMemberTo, setAddingMemberTo] = useState<string | null>(null);
  const [addingBancadaTo, setAddingBancadaTo] = useState<string | null>(null);
  const [availableMembers, setAvailableMembers] = useState<AvailableMember[]>([]);
  const [availableBancadas, setAvailableBancadas] = useState<AvailableBancada[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingBancadas, setLoadingBancadas] = useState(false);

  useEffect(() => {
    const filtered = sessions.filter((session) => {
      const term = searchTerm.toLowerCase();
      return (
        session.titleSession.toLowerCase().includes(term) ||
        session.typeSession.toLowerCase().includes(term) ||
        session.statusSession.toLowerCase().includes(term) ||
        session.modality.toLowerCase().includes(term) ||
        session.placeEnclosure.toLowerCase().includes(term)
      );
    });
    setFilteredSessions(filtered);
  }, [sessions, searchTerm]);

  useEffect(() => {
    setMounted(true);
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionRepository.getAll();
      setSessions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar sesiones";
      logger.error("PAGE: Error al cargar sesiones", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableMembers = async (sessionId: string) => {
    try {
      setLoadingMembers(true);
      const members = await sessionRepository.getAvailableMembers(sessionId);
      setAvailableMembers(members);
    } catch (err) {
      logger.error("PAGE: Error al cargar miembros disponibles", { error: err instanceof Error ? err.message : err });
    } finally {
      setLoadingMembers(false);
    }
  };

  const loadAvailableBancadas = async (sessionId: string) => {
    try {
      setLoadingBancadas(true);
      const bancadas = await sessionRepository.getAvailableBancadas(sessionId);
      setAvailableBancadas(bancadas);
    } catch (err) {
      logger.error("PAGE: Error al cargar bancadas disponibles", { error: err instanceof Error ? err.message : err });
    } finally {
      setLoadingBancadas(false);
    }
  };

  const handleAddMember = async (sessionId: string, memberId: string) => {
    try {
      await sessionRepository.addMember(sessionId, memberId);
      logger.success("PAGE: Miembro agregado exitosamente");
      setAddingMemberTo(null);
      await loadSessions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al agregar miembro";
      logger.error("PAGE: Error al agregar miembro", { error: errorMessage });
      setError(errorMessage);
    }
  };

  const handleRemoveMember = async (sessionId: string, memberId: string) => {
    if (!confirm("¿Está seguro de remover este miembro de la sesión?")) return;
    
    try {
      await sessionRepository.removeMember(sessionId, memberId);
      logger.success("PAGE: Miembro removido exitosamente");
      await loadSessions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al remover miembro";
      logger.error("PAGE: Error al remover miembro", { error: errorMessage });
      setError(errorMessage);
    }
  };

  const handleAddBancada = async (sessionId: string, bancadaId: string) => {
    try {
      await sessionRepository.addBancada(sessionId, bancadaId);
      logger.success("PAGE: Bancada agregada exitosamente");
      setAddingBancadaTo(null);
      await loadSessions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al agregar bancada";
      logger.error("PAGE: Error al agregar bancada", { error: errorMessage });
      setError(errorMessage);
    }
  };

  const handleRemoveBancada = async (sessionId: string, bancadaId: string) => {
    if (!confirm("¿Está seguro de remover esta bancada de la sesión?")) return;
    
    try {
      await sessionRepository.removeBancada(sessionId, bancadaId);
      logger.success("PAGE: Bancada removida exitosamente");
      await loadSessions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al remover bancada";
      logger.error("PAGE: Error al remover bancada", { error: errorMessage });
      setError(errorMessage);
    }
  };

  const toggleExpand = async (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };

  const openAddMember = async (sessionId: string) => {
    setAddingMemberTo(sessionId);
    setAddingBancadaTo(null);
    await loadAvailableMembers(sessionId);
  };

  const openAddBancada = async (sessionId: string) => {
    setAddingBancadaTo(sessionId);
    setAddingMemberTo(null);
    await loadAvailableBancadas(sessionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Convocada": return "bg-blue-100 text-blue-800";
      case "En progreso": return "bg-yellow-100 text-yellow-800";
      case "Realizada": return "bg-green-100 text-green-800";
      case "Cancelada": return "bg-red-100 text-red-800";
      case "Postergada": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Ordinaria": return "bg-green-50 text-green-700 border-green-200";
      case "Extraordinaria": return "bg-red-50 text-red-700 border-red-200";
      case "Especial": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Instalacion": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
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
            <h1 className="text-3xl font-light text-[#3d2f1f]">Sesiones del Consejo Municipal</h1>
            <p className="text-[#8b7355] mt-1">Gestión de sesiones, miembros y bancadas</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/session")}
              className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
            >
              + Nueva Sesión
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar sesiones por título, tipo, estado, modalidad o lugar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white border border-[#d4c5b0] rounded-lg text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f] focus:border-transparent transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b8a896]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
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
              {filteredSessions.length} {filteredSessions.length === 1 ? 'resultado' : 'resultados'} para "{searchTerm}"
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
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 border border-[#d4c5b0] text-center">
            {searchTerm ? (
              <>
                <p className="text-[#8b7355] mb-4">No se encontraron sesiones para "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
                >
                  Limpiar búsqueda
                </button>
              </>
            ) : (
              <>
                <p className="text-[#8b7355] mb-4">No hay sesiones registradas</p>
                <button
                  onClick={() => router.push("/session")}
                  className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
                >
                  Crear primera sesión
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-lg border border-[#d4c5b0] overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-[#faf8f5] transition-colors"
                  onClick={() => toggleExpand(session.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-medium text-[#3d2f1f]">{session.titleSession}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(session.typeSession)} border`}>
                          {session.typeSession}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.statusSession)}`}>
                          {session.statusSession}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#8b7355]">
                        <div>
                          <span className="font-medium">Inicio:</span> {new Date(session.dateHourStart).toLocaleDateString("es-CO")}
                        </div>
                        <div>
                          <span className="font-medium">Fin:</span> {new Date(session.dateHourEnd).toLocaleDateString("es-CO")}
                        </div>
                        <div>
                          <span className="font-medium">Modalidad:</span> {session.modality}
                        </div>
                        <div>
                          <span className="font-medium">Quórum:</span> {session.quorumRequired}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg 
                        className={`w-6 h-6 text-[#8b7355] transition-transform ${expandedSession === session.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-[#f5f1eb] px-2 py-1 rounded text-[#8b7355]">
                        {session.members.length} miembros
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-[#f5f1eb] px-2 py-1 rounded text-[#8b7355]">
                        {session.bancadas.length} bancadas
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/session/${session.id}`); }}
                      className="ml-auto px-3 py-1 text-xs bg-[#3d2f1f] text-white rounded hover:bg-[#5a4332] transition-colors"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>

                {expandedSession === session.id && (
                  <div className="border-t border-[#e5ddd0] p-6 bg-[#faf8f5]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-[#3d2f1f]">Miembros ({session.members.length})</h4>
                          <button
                            onClick={(e) => { e.stopPropagation(); openAddMember(session.id); }}
                            className="px-3 py-1 text-xs bg-[#3d2f1f] text-white rounded hover:bg-[#5a4332] transition-colors"
                          >
                            + Agregar
                          </button>
                        </div>
                        
                        {session.members.length === 0 ? (
                          <p className="text-sm text-[#8b7355] italic">No hay miembros registrados</p>
                        ) : (
                          <div className="space-y-2">
                            {session.members.map((member) => (
                              <div key={member.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-[#e5ddd0]">
                                <div>
                                  <p className="font-medium text-[#3d2f1f]">{member.memberName}</p>
                                  <p className="text-xs text-[#8b7355]">{member.memberDocument}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${member.isPresent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {member.isPresent ? 'Presente' : 'Ausente'}
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveMember(session.id, member.idMember); }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-[#3d2f1f]">Bancadas ({session.bancadas.length})</h4>
                          <button
                            onClick={(e) => { e.stopPropagation(); openAddBancada(session.id); }}
                            className="px-3 py-1 text-xs bg-[#3d2f1f] text-white rounded hover:bg-[#5a4332] transition-colors"
                          >
                            + Agregar
                          </button>
                        </div>
                        
                        {session.bancadas.length === 0 ? (
                          <p className="text-sm text-[#8b7355] italic">No hay bancadas registradas</p>
                        ) : (
                          <div className="space-y-2">
                            {session.bancadas.map((bancada) => (
                              <div key={bancada.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-[#e5ddd0]">
                                <div>
                                  <p className="font-medium text-[#3d2f1f]">{bancada.bancadaProfesion}</p>
                                  <p className="text-xs text-[#8b7355]">{bancada.bancadaTipoCurul}</p>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRemoveBancada(session.id, bancada.idBancada); }}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {addingMemberTo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-[#3d2f1f] mb-4">Agregar Miembro</h3>
                
                {loadingMembers ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2f1f]"></div>
                  </div>
                ) : availableMembers.length === 0 ? (
                  <p className="text-[#8b7355] text-center py-4">Todos los miembros ya están registrados</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => handleAddMember(addingMemberTo, member.id)}
                        className="w-full p-3 text-left bg-[#faf8f5] hover:bg-[#e5ddd0] rounded-lg transition-colors"
                      >
                        <p className="font-medium text-[#3d2f1f]">{member.fullName}</p>
                        <p className="text-xs text-[#8b7355]">{member.documentNumber}</p>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setAddingMemberTo(null)}
                    className="px-4 py-2 bg-[#f5f1eb] text-[#3d2f1f] rounded-lg hover:bg-[#e5ddd0] transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {addingBancadaTo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-[#3d2f1f] mb-4">Agregar Bancada</h3>
                
                {loadingBancadas ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2f1f]"></div>
                  </div>
                ) : availableBancadas.length === 0 ? (
                  <p className="text-[#8b7355] text-center py-4">Todas las bancadas ya están registradas</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableBancadas.map((bancada) => (
                      <button
                        key={bancada.id}
                        onClick={() => handleAddBancada(addingBancadaTo, bancada.id)}
                        className="w-full p-3 text-left bg-[#faf8f5] hover:bg-[#e5ddd0] rounded-lg transition-colors"
                      >
                        <p className="font-medium text-[#3d2f1f]">{bancada.profesion}</p>
                        <p className="text-xs text-[#8b7355]">{bancada.tipoCurul}</p>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setAddingBancadaTo(null)}
                    className="px-4 py-2 bg-[#f5f1eb] text-[#3d2f1f] rounded-lg hover:bg-[#e5ddd0] transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
