"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";
import { DjangoVoteRepository } from "@/app/core/infrastructure/adapters/django-vote.repository";
import { DjangoConsultationRepository } from "@/app/core/infrastructure/adapters/django-consultation.repository";
import { DjangoPartyRepository } from "@/app/core/infrastructure/adapters/django-party.repository";
import { DjangoPartyMemberRepository } from "@/app/core/infrastructure/adapters/django-party-member.repository";
import {
  GetAllVotesUseCase,
  GetVoteDetailsUseCase,
} from "@/app/core/application/usecases/vote.usecases";
import { VoteSummary, VoteDetail } from "@/app/core/domain/types/vote";
import { logger } from "@/app/core/infrastructure/logger/logger";

const voteRepository = new DjangoVoteRepository();
const consultationRepository = new DjangoConsultationRepository();
const partyRepository = new DjangoPartyRepository();
const memberRepository = new DjangoPartyMemberRepository();

const getAllVotesUseCase = new GetAllVotesUseCase(
  voteRepository,
  consultationRepository,
);
const getVoteDetailsUseCase = new GetVoteDetailsUseCase(
  voteRepository,
  consultationRepository,
  partyRepository,
  memberRepository,
);

function VoteListContent() {
  const [mounted, setMounted] = useState(false);
  const [voteSummaries, setVoteSummaries] = useState<VoteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [
    selectedConsultation,
    setSelectedConsultation,
  ] = useState<VoteSummary | null>(null);
  const [voteDetails, setVoteDetails] = useState<VoteDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadVotes();
  }, []);

  const loadVotes = async () => {
    try {
      setLoading(true);
      const data = await getAllVotesUseCase.execute();
      setVoteSummaries(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar votos";
      logger.error("PAGE: Error al cargar votos", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (summary: VoteSummary) => {
    setSelectedConsultation(summary);
    setLoadingDetails(true);

    try {
      const { details } = await getVoteDetailsUseCase.execute(
        summary.consultationId,
      );
      console.log("VOTE DETAILS PAGE:", JSON.stringify(details, null, 2));
      setVoteDetails(details);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar detalles";
      logger.error("PAGE: Error al cargar detalles", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredVotes = voteSummaries.filter((vote) => {
    const term = searchTerm.toLowerCase();
    return vote.consultationTitle.toLowerCase().includes(term);
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
              Votos por Consulta
            </h2>
            <p className="text-[#8b7355] mt-1">
              {searchTerm
                ? `${filteredVotes.length} de ${voteSummaries.length} consulta(s)`
                : `${voteSummaries.length} consulta(s) con votos`}
            </p>
          </div>
          <button
            onClick={loadVotes}
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
              placeholder="Buscar por nombre de consulta..."
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
        ) : filteredVotes.length === 0 ? (
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
                <p className="mt-4 text-[#8b7355]">No hay votos registrados</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f1eb] border-b-2 border-[#d4c5b0]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">
                    Nombre de la Consulta
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#3d2f1f]">
                    Cantidad de Votos
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#16a34a]">
                    Votos a Favor
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#dc2626]">
                    Votos en Contra
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#3d2f1f]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVotes.map((vote, index) => (
                  <tr
                    key={vote.consultationId}
                    className={`border-b border-[#e5ddd0] hover:bg-[#faf8f5] transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-[#faf8f5]"
                    }`}
                  >
                    <td className="px-4 py-4 text-[#3d2f1f] font-medium">
                      {vote.consultationTitle}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8b7355] text-white">
                        {vote.totalVotes}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {vote.votesInFavor}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {vote.votesAgainst}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleViewDetails(vote)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium text-[#3d2f1f]">
                  Detalle de Votos
                </h3>
                <p className="text-sm text-[#8b7355] mt-1">
                  {selectedConsultation.consultationTitle}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedConsultation(null);
                  setVoteDetails([]);
                }}
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

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#f5f1eb] p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#3d2f1f]">
                  {selectedConsultation.totalVotes}
                </p>
                <p className="text-sm text-[#8b7355]">Total Votos</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {selectedConsultation.votesInFavor}
                </p>
                <p className="text-sm text-green-700">A Favor</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">
                  {selectedConsultation.votesAgainst}
                </p>
                <p className="text-sm text-red-700">En Contra</p>
              </div>
            </div>

            {selectedConsultation.votesInFavor >
              selectedConsultation.votesAgainst && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
                <p className="text-lg font-bold text-green-800">
                  ✓ GANÓ LA OPCIÓN "A FAVOR"
                </p>
              </div>
            )}
            {selectedConsultation.votesAgainst >
              selectedConsultation.votesInFavor && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-center">
                <p className="text-lg font-bold text-red-800">
                  ✗ GANÓ LA OPCIÓN "EN CONTRA"
                </p>
              </div>
            )}
            {selectedConsultation.votesInFavor ===
              selectedConsultation.votesAgainst &&
              selectedConsultation.totalVotes > 0 && (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                  <p className="text-lg font-bold text-yellow-800">⚖ EMPATE</p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VoteListPage() {
  return (
    <DashboardLayout>
      <VoteListContent />
    </DashboardLayout>
  );
}
