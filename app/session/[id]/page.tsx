"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";
import { MunicipalCouncilSession } from "@/app/core/domain/types/municipal-council-session";
import { DjangoMunicipalCouncilSessionRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-session.repository";
import { logger } from "@/app/core/infrastructure/logger/logger";

const sessionRepository = new DjangoMunicipalCouncilSessionRepository();

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<MunicipalCouncilSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingMemberTo, setAddingMemberTo] = useState(false);
  const [addingBancadaTo, setAddingBancadaTo] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<
    { id: string; fullName: string; documentNumber: string }[]
  >([]);
  const [availableBancadas, setAvailableBancadas] = useState<
    { id: string; tipoCurul: string; profesion: string }[]
  >([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingBancadas, setLoadingBancadas] = useState(false);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const allSessions = await sessionRepository.getAll();
      const foundSession = allSessions.find((s) => s.id === sessionId);

      if (foundSession) {
        setSession(foundSession);
      } else {
        setError("Sesión no encontrada");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar la sesión";
      logger.error("PAGE: Error al cargar sesión", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableMembers = async () => {
    try {
      setLoadingMembers(true);
      const members = await sessionRepository.getAvailableMembers(sessionId);
      setAvailableMembers(members);
      setAddingMemberTo(true);
    } catch (err) {
      logger.error("PAGE: Error al cargar miembros disponibles", {
        error: err instanceof Error ? err.message : err,
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  const loadAvailableBancadas = async () => {
    try {
      setLoadingBancadas(true);
      const bancadas = await sessionRepository.getAvailableBancadas(sessionId);
      setAvailableBancadas(bancadas);
      setAddingBancadaTo(true);
    } catch (err) {
      logger.error("PAGE: Error al cargar bancadas disponibles", {
        error: err instanceof Error ? err.message : err,
      });
    } finally {
      setLoadingBancadas(false);
    }
  };

  const handleAddMember = async (memberId: string) => {
    try {
      await sessionRepository.addMember(sessionId, memberId);
      logger.success("PAGE: Miembro agregado exitosamente");
      setAddingMemberTo(false);
      await loadSession();
    } catch (err) {
      logger.error("PAGE: Error al agregar miembro", {
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("¿Está seguro de remover este miembro de la sesión?")) return;

    try {
      await sessionRepository.removeMember(sessionId, memberId);
      logger.success("PAGE: Miembro removido exitosamente");
      await loadSession();
    } catch (err) {
      logger.error("PAGE: Error al remover miembro", {
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  const handleAddBancada = async (bancadaId: string) => {
    try {
      await sessionRepository.addBancada(sessionId, bancadaId);
      logger.success("PAGE: Bancada agregada exitosamente");
      setAddingBancadaTo(false);
      await loadSession();
    } catch (err) {
      logger.error("PAGE: Error al agregar bancada", {
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  const handleRemoveBancada = async (bancadaId: string) => {
    if (!confirm("¿Está seguro de remover esta bancada de la sesión?")) return;

    try {
      await sessionRepository.removeBancada(sessionId, bancadaId);
      logger.success("PAGE: Bancada removida exitosamente");
      await loadSession();
    } catch (err) {
      logger.error("PAGE: Error al remover bancada", {
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Convocada":
        return "bg-blue-100 text-blue-800";
      case "En progreso":
        return "bg-yellow-100 text-yellow-800";
      case "Realizada":
        return "bg-green-100 text-green-800";
      case "Cancelada":
        return "bg-red-100 text-red-800";
      case "Postergada":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Ordinaria":
        return "bg-green-100 text-green-800 border-green-200";
      case "Extraordinaria":
        return "bg-red-100 text-red-800 border-red-200";
      case "Especial":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Instalacion":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f] mx-auto"></div>
            <p className="mt-4 text-[#8b7355]">Cargando sesión...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !session) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 border border-[#d4c5b0] text-center">
            <p className="text-red-600 mb-4">
              {error || "Sesión no encontrada"}
            </p>
            <button
              onClick={() => router.push("/session/list")}
              className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/session/list")}
            className="flex items-center gap-2 text-[#8b7355] hover:text-[#3d2f1f] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a la lista
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-[#d4c5b0] overflow-hidden">
          <div className="p-8 border-b border-[#e5ddd0] bg-gradient-to-r from-[#3d2f1f] to-[#5a4332]">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(
                  session.typeSession,
                )}`}
              >
                {session.typeSession}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  session.statusSession,
                )}`}
              >
                {session.statusSession}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-4">
              <span className="text-white">{session.titleSession}</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Inicio:{" "}
                  {new Date(session.dateHourStart).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Fin:{" "}
                  {new Date(session.dateHourEnd).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span>{session.placeEnclosure}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Quórum requerido: {session.quorumRequired}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-[#3d2f1f] mb-3">
                Orden del Día
              </h2>
              <div className="bg-[#faf8f5] rounded-lg p-4 border border-[#e5ddd0]">
                <pre className="whitespace-pre-wrap text-[#8b7355] text-sm font-light leading-relaxed">
                  {session.ordenDay}
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#faf8f5] rounded-lg p-6 border border-[#e5ddd0]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-[#3d2f1f]">
                    Miembros ({session.members.length})
                  </h2>
                  <button
                    onClick={loadAvailableMembers}
                    className="px-3 py-1 text-xs bg-[#3d2f1f] text-white rounded hover:bg-[#5a4332] transition-colors"
                  >
                    + Agregar
                  </button>
                </div>

                {session.members.length === 0 ? (
                  <p className="text-sm text-[#8b7355] italic text-center py-4">
                    No hay miembros registrados
                  </p>
                ) : (
                  <div className="space-y-3">
                    {session.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex justify-between items-center p-3 bg-white rounded-lg border border-[#e5ddd0]"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-[#3d2f1f]">
                              {member.memberName
                                ? member.memberName
                                : "Desconocido"}
                            </p>
                            <p className="text-xs text-[#8b7355]">
                              {member.memberDocument
                                ? member.memberDocument
                                : "1234567890"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.isPresent
                                ? "bg-green-300 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <span className="font-medium text-sm">
                              {member.isPresent ? "Presente" : "Ausente"}
                            </span>
                          </span>
                          <button
                            onClick={() => handleRemoveMember(member.idMember)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#faf8f5] rounded-lg p-6 border border-[#e5ddd0]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-[#3d2f1f]">
                    Bancadas ({session.bancadas.length})
                  </h2>
                  <button
                    onClick={loadAvailableBancadas}
                    className="px-3 py-1 text-xs bg-[#3d2f1f] text-white rounded hover:bg-[#5a4332] transition-colors"
                  >
                    + Agregar
                  </button>
                </div>

                {session.bancadas.length === 0 ? (
                  <p className="text-sm text-[#8b7355] italic text-center py-4">
                    No hay bancadas registradas
                  </p>
                ) : (
                  <div className="space-y-3">
                    {session.bancadas.map((bancada) => (
                      <div
                        key={bancada.id}
                        className="flex justify-between items-center p-3 bg-white rounded-lg border border-[#e5ddd0]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#5a4332] rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {bancada.bancadaProfesion.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#3d2f1f]">
                              {bancada.bancadaProfesion}
                            </p>
                            <p className="text-xs text-[#8b7355]">
                              {bancada.bancadaTipoCurul}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBancada(bancada.idBancada)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {addingMemberTo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-[#3d2f1f] mb-4">
                Agregar Miembro
              </h3>

              {loadingMembers ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2f1f]"></div>
                </div>
              ) : availableMembers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-[#8b7355] mb-4">
                    Todos los miembros ya están registrados
                  </p>
                  <button
                    onClick={() => setAddingMemberTo(false)}
                    className="px-4 py-2 bg-[#f5f1eb] text-[#3d2f1f] rounded-lg hover:bg-[#e5ddd0] transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleAddMember(member.id)}
                      className="w-full p-3 text-left bg-[#faf8f5] hover:bg-[#e5ddd0] rounded-lg transition-colors"
                    >
                      <p className="font-medium text-[#3d2f1f]">
                        {member.fullName}
                      </p>
                      <p className="text-xs text-[#8b7355]">
                        {member.documentNumber}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setAddingMemberTo(false)}
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
              <h3 className="text-lg font-medium text-[#3d2f1f] mb-4">
                Agregar Bancada
              </h3>

              {loadingBancadas ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2f1f]"></div>
                </div>
              ) : availableBancadas.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-[#8b7355] mb-4">
                    Todas las bancadas ya están registradas
                  </p>
                  <button
                    onClick={() => setAddingBancadaTo(false)}
                    className="px-4 py-2 bg-[#f5f1eb] text-[#3d2f1f] rounded-lg hover:bg-[#e5ddd0] transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableBancadas.map((bancada) => (
                    <button
                      key={bancada.id}
                      onClick={() => handleAddBancada(bancada.id)}
                      className="w-full p-3 text-left bg-[#faf8f5] hover:bg-[#e5ddd0] rounded-lg transition-colors"
                    >
                      <p className="font-medium text-[#3d2f1f]">
                        {bancada.profesion}
                      </p>
                      <p className="text-xs text-[#8b7355]">
                        {bancada.tipoCurul}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setAddingBancadaTo(false)}
                  className="px-4 py-2 bg-[#f5f1eb] text-[#3d2f1f] rounded-lg hover:bg-[#e5ddd0] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
