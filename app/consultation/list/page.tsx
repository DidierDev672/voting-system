"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";
import { DjangoConsultationRepository } from "@/app/core/infrastructure/adapters/django-consultation.repository";
import {
  GetAllConsultationsUseCase,
  DeleteConsultationUseCase,
} from "@/app/core/application/usecases/consultation.usecases";
import {
  Consultation,
  ConsultationStatus,
} from "@/app/core/domain/types/consultation";
import { logger } from "@/app/core/infrastructure/logger/logger";
import { VoteFormModal } from "../components/VoteFormModal";

const consultationRepository = new DjangoConsultationRepository();
const getAllConsultationsUseCase = new GetAllConsultationsUseCase(
  consultationRepository,
);
const deleteConsultationUseCase = new DeleteConsultationUseCase(
  consultationRepository,
);

function ConsultationListContent() {
  const [mounted, setMounted] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [
    selectedConsultation,
    setSelectedConsultation,
  ] = useState<Consultation | null>(null);
  const [votingConsultation, setVotingConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    setMounted(true);
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const data = await getAllConsultationsUseCase.execute();
      setConsultations(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar consultas";
      logger.error("PAGE: Error al cargar consultas", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta consulta?")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteConsultationUseCase.execute(id);
      logger.success("PAGE: Consulta eliminada", { id });
      setConsultations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar consulta";
      logger.error("PAGE: Error al eliminar consulta", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusLabel = (
    status: ConsultationStatus,
  ): { label: string; className: string } => {
    const statusMap: Record<
      ConsultationStatus,
      { label: string; className: string }
    > = {
      draft: { label: "Borrador", className: "bg-gray-100 text-gray-800" },
      published: {
        label: "Publicada",
        className: "bg-green-100 text-green-800",
      },
      closed: { label: "Cerrada", className: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || {
        label: status,
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  const filteredConsultations = consultations.filter((consultation) => {
    const term = searchTerm.toLowerCase();
    return (
      consultation.title.toLowerCase().includes(term) ||
      consultation.description.toLowerCase().includes(term) ||
      consultation.proprietaryRepresentation.toLowerCase().includes(term)
    );
  });

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#d4c5b0]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-medium text-[#3d2f1f]">
              Lista de Consultas Populares
            </h2>
            <p className="text-[#8b7355] mt-1">
              {searchTerm
                ? `${filteredConsultations.length} de ${consultations.length} consulta(s)`
                : `${consultations.length} consulta(s) registrada(s)`}
            </p>
          </div>
          <button
            onClick={loadConsultations}
            className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#2a1f13] transition-colors flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Actualizar
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#f5e6e0] to-[#fef5f3] border-l-4 border-[#d4a574] rounded-r-md">
            <p className="text-sm text-[#c17767]">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-[#b8a896]"
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
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, descripción o representación..."
              className="w-full pl-12 pr-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:border-[#8b7355] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#b8a896] hover:text-[#3d2f1f]"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3d2f1f]"></div>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <>
                <svg
                  className="w-16 h-16 mx-auto text-[#d4c5b0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="mt-4 text-[#8b7355]">
                  No se encontraron consultas con "{searchTerm}"
                </p>
              </>
            ) : (
              <>
                <svg
                  className="w-16 h-16 mx-auto text-[#d4c5b0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-[#8b7355]">
                  No hay consultas populares registradas
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f1eb] border-b-2 border-[#d4c5b0]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">
                    Título
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#3d2f1f]">
                    Preguntas
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#3d2f1f]">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">
                    Representación
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#3d2f1f]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredConsultations.map((consultation, index) => {
                  const statusInfo = getStatusLabel(consultation.status);
                  return (
                    <tr
                      key={consultation.id}
                      className={`border-b border-[#e5ddd0] hover:bg-[#faf8f5] transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-[#faf8f5]"
                      }`}
                    >
                      <td className="px-4 py-4 text-[#3d2f1f] font-medium">
                        {consultation.title}
                      </td>
                      <td className="px-4 py-4 text-[#3d2f1f]">
                        <span className="line-clamp-2">
                          {consultation.description}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8b7355] text-white">
                          {consultation.questions?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#3d2f1f]">
                        {consultation.proprietaryRepresentation}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() =>
                              setSelectedConsultation(consultation)
                            }
                            className="p-2 text-[#8b7355] hover:text-[#3d2f1f] hover:bg-[#e5ddd0] rounded-lg transition-colors"
                            title="Ver detalle"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          {consultation.status === 'published' && (
                            <button
                              onClick={() => setVotingConsultation(consultation)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                              title="Votar"
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
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(consultation.id)}
                            disabled={deletingId === consultation.id}
                            className="p-2 text-[#c17767] hover:text-red-700 hover:bg-[#f5e6e0] rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            {deletingId === consultation.id ? (
                              <svg
                                className="w-5 h-5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                              </svg>
                            ) : (
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-[#3d2f1f]">
                Detalle de Consulta
              </h3>
              <button
                onClick={() => setSelectedConsultation(null)}
                className="text-[#8b7355] hover:text-[#3d2f1f]"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Título:</span>
                <span className="text-[#3d2f1f] font-medium">
                  {selectedConsultation.title}
                </span>
              </div>

              <div className="border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Descripción:</span>
                <p className="text-[#3d2f1f] mt-1">
                  {selectedConsultation.description}
                </p>
              </div>

              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Estado:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedConsultation.status === "published"
                      ? "bg-green-100 text-green-800"
                      : selectedConsultation.status === "closed"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedConsultation.status === "published"
                    ? "Publicada"
                    : selectedConsultation.status === "closed"
                    ? "Cerrada"
                    : "Borrador"}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Representación:</span>
                <span className="text-[#3d2f1f]">
                  {selectedConsultation.proprietaryRepresentation}
                </span>
              </div>

              <div>
                <span className="text-[#8b7355]">
                  Preguntas ({selectedConsultation.questions?.length || 0}):
                </span>
                <div className="mt-2 space-y-3">
                  {selectedConsultation.questions?.map((q, index) => (
                    <div
                      key={index}
                      className="bg-[#faf8f5] p-3 rounded-lg border border-[#e5ddd0]"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[#3d2f1f] font-medium">
                          {index + 1}. {q.text}
                        </span>
                        <span className="text-xs text-[#8b7355]">
                          {q.questionType === "text"
                            ? "Abierta"
                            : q.questionType === "single_choice"
                            ? "Única respuesta"
                            : q.questionType === "multiple_choice"
                            ? "Selección múltiple"
                            : "Escala"}
                        </span>
                      </div>
                      {q.options && q.options.length > 0 && (
                        <ul className="mt-2 ml-4 list-disc list-inside text-sm text-[#3d2f1f]">
                          {q.options.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {votingConsultation && (
        <VoteFormModal
          consultation={votingConsultation}
          onClose={() => setVotingConsultation(null)}
          onVoteSuccess={loadConsultations}
        />
      )}
    </div>
  );
}

export default function ConsultationListPage() {
  return (
    <DashboardLayout>
      <ConsultationListContent />
    </DashboardLayout>
  );
}
