"use client";

import { useState, useEffect } from "react";
import { DjangoPartyRepository } from "@/app/core/infrastructure/adapters/django-party.repository";
import {
  GetAllPartiesUseCase,
  DeletePartyUseCase,
} from "@/app/core/application/usecases/party.usecases";
import { PoliticalParty } from "@/app/core/domain/types/party";
import { logger } from "@/app/core/infrastructure/logger/logger";

const partyRepository = new DjangoPartyRepository();
const getAllPartiesUseCase = new GetAllPartiesUseCase(partyRepository);
const deletePartyUseCase = new DeletePartyUseCase(partyRepository);

export default function PartyListPage() {
  const [mounted, setMounted] = useState(false);
  const [parties, setParties] = useState<PoliticalParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<PoliticalParty | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
    loadParties();
  }, []);

  const loadParties = async () => {
    try {
      setLoading(true);
      const data = await getAllPartiesUseCase.execute();
      setParties(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar partidos";
      logger.error("PAGE: Error al cargar partidos", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredParties = parties.filter((party) => {
    const term = searchTerm.toLowerCase();
    return (
      party.name.toLowerCase().includes(term) ||
      party.acronym.toLowerCase().includes(term) ||
      party.legalRepresentative.toLowerCase().includes(term)
    );
  });

  const handleDelete = async (id: string) => {
    if (
      !confirm("¿Estás seguro de que deseas eliminar este partido político?")
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await deletePartyUseCase.execute(id);
      logger.success("PAGE: Partido eliminado", { id });
      setParties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar partido";
      logger.error("PAGE: Error al eliminar partido", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#d4c5b0]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-medium text-[#3d2f1f]">
              Lista de Partidos Políticos
            </h2>
            <p className="text-[#8b7355] mt-1">
              {searchTerm
                ? `${filteredParties.length} de ${parties.length} partido(s)`
                : `${parties.length} partido(s) registrado(s)`}
            </p>
          </div>
          <button
            onClick={loadParties}
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
              placeholder="Buscar por nombre, siglas o representante..."
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
        ) : filteredParties.length === 0 ? (
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
                  No se encontraron partidos con "{searchTerm}"
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <p className="mt-4 text-[#8b7355]">
                  No hay partidos políticos registrados
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
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">
                    Siglas
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">
                    Representante Legal
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#3d2f1f]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredParties.map((party, index) => (
                  <tr
                    key={party.id}
                    className={`border-b border-[#e5ddd0] hover:bg-[#faf8f5] transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-[#faf8f5]"
                    }`}
                  >
                    <td className="px-4 py-4 text-[#3d2f1f]">{party.name}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8b7355] text-white">
                        {party.acronym}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#3d2f1f]">
                      {party.legalRepresentative}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => setSelectedParty(party)}
                          className="p-2 text-[#8b7355] hover:text-[#3d2f1f] hover:bg-[#e5ddd0] rounded-lg transition-colors"
                          title="Visualizar"
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
                        <button
                          onClick={() => handleDelete(party.id)}
                          disabled={deletingId === party.id}
                          className="p-2 text-[#c17767] hover:text-red-700 hover:bg-[#f5e6e0] rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deletingId === party.id ? (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedParty && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-[#3d2f1f]">
                Detalles del Partido
              </h3>
              <button
                onClick={() => setSelectedParty(null)}
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
            <div className="space-y-3">
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Nombre:</span>
                <span className="text-[#3d2f1f] font-medium">
                  {selectedParty.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Siglas:</span>
                <span className="text-[#3d2f1f] font-medium">
                  {selectedParty.acronym}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Tipo:</span>
                <span className="text-[#3d2f1f] font-medium capitalize">
                  {selectedParty.partyType}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Ideología:</span>
                <span className="text-[#3d2f1f]">
                  {selectedParty.ideology || "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Representante:</span>
                <span className="text-[#3d2f1f]">
                  {selectedParty.legalRepresentative}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">ID Representante:</span>
                <span className="text-[#3d2f1f]">
                  {selectedParty.representativeId}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Email:</span>
                <span className="text-[#3d2f1f]">
                  {selectedParty.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#e5ddd0] pb-2">
                <span className="text-[#8b7355]">Fecha Fundación:</span>
                <span className="text-[#3d2f1f]">
                  {selectedParty.foundationDate || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b7355]">Estado:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedParty.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedParty.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
