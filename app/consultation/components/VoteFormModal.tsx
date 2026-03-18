"use client";

import { useState, useEffect } from "react";
import { DjangoVoteRepository } from "@/app/core/infrastructure/adapters/django-vote.repository";
import { DjangoPartyRepository } from "@/app/core/infrastructure/adapters/django-party.repository";
import { DjangoPartyMemberRepository } from "@/app/core/infrastructure/adapters/django-party-member.repository";
import { CreateVoteUseCase } from "@/app/core/application/usecases/vote.usecases";
import { PoliticalParty } from "@/app/core/domain/types/party";
import { PartyMember } from "@/app/core/domain/types/party-member";
import { Consultation } from "@/app/core/domain/types/consultation";
import { logger } from "@/app/core/infrastructure/logger/logger";

const voteRepository = new DjangoVoteRepository();
const partyRepository = new DjangoPartyRepository();
const memberRepository = new DjangoPartyMemberRepository();
const createVoteUseCase = new CreateVoteUseCase(voteRepository);

interface VoteFormModalProps {
  consultation: Consultation;
  onClose: () => void;
  onVoteSuccess: () => void;
}

export function VoteFormModal({
  consultation,
  onClose,
  onVoteSuccess,
}: VoteFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [parties, setParties] = useState<PoliticalParty[]>([]);
  const [loadingParties, setLoadingParties] = useState(true);
  const [memberWarning, setMemberWarning] = useState("");
  const [memberFound, setMemberFound] = useState<PartyMember | null>(null);
  const [validatingMember, setValidatingMember] = useState(false);
  const [formData, setFormData] = useState({
    partyId: "",
    valueVote: true,
    comment: "",
  });
  const [documentNumber, setDocumentNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadParties();
  }, []);

  const loadParties = async () => {
    try {
      setLoadingParties(true);
      const data = await partyRepository.getAll();
      logger.info("MODAL: Todos los partidos", { count: data.length });
      setParties(data);
    } catch (err) {
      logger.error("MODAL: Error al cargar partidos", {
        error: err instanceof Error ? err.message : err,
      });
    } finally {
      setLoadingParties(false);
    }
  };

  const validateMember = async (documentNumber: string) => {
    if (!documentNumber || documentNumber.length < 3) {
      setMemberWarning("");
      setMemberFound(null);
      setFormData({ ...formData, partyId: "" });
      return;
    }

    setValidatingMember(true);
    setMemberWarning("");

    try {
      const member = await memberRepository.getByDocumentNumber(documentNumber);
      console.log("MEMBER RESPONSE:", JSON.stringify(member, null, 2));
      if (member) {
        setMemberFound(member);
        setFormData({ ...formData, partyId: member.politicalPartyId });
        console.log("MODAL: Miembro encontrado", {
          memberId: member.id,
          partyId: member.politicalPartyId,
        });
        logger.info("MODAL: Miembro encontrado", {
          memberId: member.id,
          partyId: member.politicalPartyId,
        });
      } else {
        setMemberFound(null);
        setFormData({ ...formData, partyId: "" });
        setMemberWarning(
          "No está registrado en ningún partido político. Debe registrarse en un partido político.",
        );
        logger.info("MODAL: Miembro no encontrado", { documentNumber });
      }
    } catch (err) {
      console.error("ERROR validateMember:", err);
      logger.error("MODAL: Error al validar miembro", {
        error: err instanceof Error ? err.message : err,
      });
      setMemberWarning("");
    } finally {
      setValidatingMember(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!memberFound) {
      setError(
        "Debe verificar su membresía en un partido político antes de votar.",
      );
      setLoading(false);
      return;
    }

    if (!memberFound.id || !memberFound.id.match(/^[0-9a-f-]{36}$/i)) {
      setError(
        "Error: ID de miembro inválido. Por favor verifique su membresía.",
      );
      console.error("Invalid member ID:", memberFound?.id);
      setLoading(false);
      return;
    }

    // Función para extraer el user_id (sub) del JWT de Supabase
    const extractSupabaseUserId = (token: string): string | null => {
      try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload.sub || null;
      } catch {
        return null;
      }
    };

    try {
      const session = localStorage.getItem("auth_session");
      const accessToken = session ? JSON.parse(session).accessToken : null;
      const authId = accessToken
        ? extractSupabaseUserId(accessToken) || undefined
        : undefined;

      console.log("=== DEBUG SUBMIT ===");
      console.log("memberFound:", memberFound);
      console.log("memberFound.id:", memberFound?.id);
      console.log("authId (Supabase user_id):", authId);

      if (!memberFound?.id || !memberFound.id.match(/^[0-9a-f-]{36}$/i)) {
        setError(
          "Error: ID de miembro inválido. Por favor verifique su membresía.",
        );
        console.error("Invalid member ID:", memberFound?.id);
        setLoading(false);
        return;
      }

      logger.info("MODAL: Iniciando registro de voto", {
        consultationId: consultation.id,
      });

      await createVoteUseCase.execute({
        idConsult: consultation.id,
        idMember: memberFound.id,
        idParty: formData.partyId,
        idAuth: authId,
        valueVote: formData.valueVote,
        comment: formData.comment || undefined,
      });

      logger.success("MODAL: Voto registrado exitosamente");
      setSuccess("Voto registrado exitosamente");

      setTimeout(() => {
        onVoteSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar voto";
      logger.error("MODAL: Error al registrar voto", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-medium text-[#3d2f1f]">
              Registrar Voto
            </h3>
            <p className="text-sm text-[#8b7355] mt-1">{consultation.title}</p>
          </div>
          <button
            onClick={onClose}
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

        {error && (
          <div className="mb-4 p-3 bg-gradient-to-r from-[#f5e6e0] to-[#fef5f3] border-l-4 border-[#d4a574] rounded-r-md">
            <p className="text-sm text-[#c17767]">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-gradient-to-r from-[#e6f5e6] to-[#f0fdf4] border-l-4 border-[#4ade80] rounded-r-md">
            <p className="text-sm text-[#16a34a]">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Número de Documento *
            </label>
            <div className="relative">
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                onBlur={(e) => validateMember(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355]"
                placeholder="Número de documento del votante"
                required
              />
              {validatingMember && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg
                    className="animate-spin h-5 w-5 text-[#8b7355]"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              )}
            </div>
            {memberWarning && (
              <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                {memberWarning}
              </p>
            )}
            {memberFound && (
              <p className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                Miembro verificado: {memberFound.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Partido Político *
            </label>
            <select
              value={formData.partyId}
              onChange={(e) =>
                setFormData({ ...formData, partyId: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355]"
              required
              disabled={loadingParties}
            >
              <option value="">
                {loadingParties ? "Cargando..." : "Seleccionar partido"}
              </option>
              {parties.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.name} ({party.acronym})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Voto *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="valueVote"
                  checked={formData.valueVote === true}
                  onChange={() => setFormData({ ...formData, valueVote: true })}
                  className="w-4 h-4 text-green-600 border-2 border-[#e5ddd0] focus:ring-[#8b7355]"
                />
                <span className="ml-2 text-sm text-[#3d2f1f]">A favor</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="valueVote"
                  checked={formData.valueVote === false}
                  onChange={() =>
                    setFormData({ ...formData, valueVote: false })
                  }
                  className="w-4 h-4 text-red-600 border-2 border-[#e5ddd0] focus:ring-[#8b7355]"
                />
                <span className="ml-2 text-sm text-[#3d2f1f]">En contra</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Comentario (Opcional)
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355]"
              placeholder="Agregar un comentario..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-[#e5ddd0] text-[#3d2f1f] rounded-lg hover:bg-[#faf8f5] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || loadingParties}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#3d2f1f] to-[#5a4332] text-white font-medium rounded-lg hover:from-[#2a1f13] hover:to-[#3d2f1f] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Votando...
                </span>
              ) : (
                "Registrar Voto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
