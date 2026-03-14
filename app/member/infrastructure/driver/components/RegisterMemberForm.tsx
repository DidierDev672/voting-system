"use client";

import { useState, useEffect, FormEvent } from "react";
import { DjangoPartyMemberRepository } from "@/app/core/infrastructure/adapters/django-party-member.repository";
import { DjangoPartyRepository } from "@/app/core/infrastructure/adapters/django-party.repository";
import { CreatePartyMemberUseCase } from "@/app/core/application/usecases/party-member.usecases";
import { PoliticalParty } from "@/app/core/domain/types/party";
import { DocumentType } from "@/app/core/domain/types/party-member";
import { logger } from "@/app/core/infrastructure/logger/logger";

const memberRepository = new DjangoPartyMemberRepository();
const partyRepository = new DjangoPartyRepository();
const createMemberUseCase = new CreatePartyMemberUseCase(memberRepository);

export default function RegisterMemberForm() {
  const [mounted, setMounted] = useState(false);
  const [parties, setParties] = useState<PoliticalParty[]>([]);
  const [loadingParties, setLoadingParties] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    documentType: "" as DocumentType | "",
    documentNumber: "",
    birthDate: "",
    city: "",
    politicalPartyId: "",
    consent: false,
    dataAuthorization: false,
    affiliationDate: new Date().toISOString().split("T")[0],
  });
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
      setParties(data);
    } catch (err) {
      logger.error("FORM: Error al cargar partidos", {
        error: err instanceof Error ? err.message : err,
      });
    } finally {
      setLoadingParties(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    logger.info("FORM: Iniciando registro de miembro", {
      fullName: formData.fullName,
    });

    try {
      const result = await createMemberUseCase.execute({
        fullName: formData.fullName,
        documentType: formData.documentType as DocumentType,
        documentNumber: formData.documentNumber,
        birthDate: formData.birthDate,
        city: formData.city,
        politicalPartyId: formData.politicalPartyId,
        consent: formData.consent,
        dataAuthorization: formData.dataAuthorization,
        affiliationDate: formData.affiliationDate,
      });

      logger.success("FORM: Miembro registrado exitosamente", {
        id: result.id,
      });
      setSuccess(`Miembro "${result.fullName}" registrado exitosamente`);

      setFormData({
        fullName: "",
        documentType: "",
        documentNumber: "",
        birthDate: "",
        city: "",
        politicalPartyId: "",
        consent: false,
        dataAuthorization: false,
        affiliationDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar miembro";
      logger.error("FORM: Error al registrar miembro", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-[#3d2f1f]">
            Registrar Miembro de Partido
          </h2>
          <p className="text-[#8b7355] mt-2">
            Complete los datos del nuevo miembro
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#f5e6e0] to-[#fef5f3] border-l-4 border-[#d4a574] rounded-r-md">
            <p className="text-sm text-[#c17767]">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#e6f5e6] to-[#f0fdf4] border-l-4 border-[#4ade80] rounded-r-md">
            <p className="text-sm text-[#16a34a]">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Nombre completo del miembro"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Partido Político *
              </label>
              <select
                value={formData.politicalPartyId}
                onChange={(e) =>
                  handleChange("politicalPartyId", e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Tipo de Documento *
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => handleChange("documentType", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="CC">Cédula de Ciudadanía (CC)</option>
                <option value="TI">Tarjeta de Identidad (TI)</option>
                <option value="CE">Cédula de Extranjería (CE)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Número de Documento *
              </label>
              <input
                type="text"
                value={formData.documentNumber}
                onChange={(e) => handleChange("documentNumber", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Número de documento"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ciudad de residencia"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Fecha de Afiliación
              </label>
              <input
                type="date"
                value={formData.affiliationDate}
                onChange={(e) =>
                  handleChange("affiliationDate", e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => handleChange("consent", e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#3d2f1f] border-2 border-[#e5ddd0] rounded focus:ring-[#8b7355] focus:ring-offset-2"
                required
              />
              <span className="ml-3 text-sm text-[#3d2f1f]">
                Acepto mi afiliación política al partido *
              </span>
            </label>

            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dataAuthorization}
                onChange={(e) =>
                  handleChange("dataAuthorization", e.target.checked)
                }
                className="w-5 h-5 mt-0.5 text-[#3d2f1f] border-2 border-[#e5ddd0] rounded focus:ring-[#8b7355] focus:ring-offset-2"
                required
              />
              <span className="ml-3 text-sm text-[#3d2f1f]">
                Autorizo el tratamiento de mis datos personales conforme a la
                Ley 1581 de 2012 *
              </span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || loadingParties}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#3d2f1f] to-[#5a4332] text-white font-medium rounded-lg hover:from-[#2a1f13] hover:to-[#3d2f1f] focus:outline-none focus:ring-4 focus:ring-[#8b7355] focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Registrando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Registrar Miembro
                  <svg
                    className="w-5 h-5 ml-2"
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
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
