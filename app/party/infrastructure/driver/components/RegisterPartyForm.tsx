"use client";

import { useState, FormEvent } from "react";
import { DjangoPartyRepository } from "@/app/core/infrastructure/adapters/django-party.repository";
import { CreatePartyUseCase } from "@/app/core/application/usecases/party.usecases";
import { PartyType } from "@/app/core/domain/types/party";
import { logger } from "@/app/core/infrastructure/logger/logger";

const partyRepository = new DjangoPartyRepository();
const createPartyUseCase = new CreatePartyUseCase(partyRepository);

export default function RegisterPartyForm() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    acronym: "",
    partyType: "" as PartyType | "",
    ideology: "",
    legalRepresentative: "",
    representativeId: "",
    email: "",
    foundationDate: "",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!mounted) {
    setMounted(true);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    logger.info("FORM: Iniciando registro de partido", { name: formData.name });

    try {
      const result = await createPartyUseCase.execute({
        name: formData.name,
        acronym: formData.acronym,
        partyType: formData.partyType as PartyType,
        ideology: formData.ideology,
        legalRepresentative: formData.legalRepresentative,
        representativeId: formData.representativeId,
        email: formData.email,
        foundationDate: formData.foundationDate,
        isActive: formData.isActive,
      });

      logger.success("FORM: Partido registrado exitosamente", {
        id: result.id,
      });
      setSuccess(`Partido político "${result.name}" registrado exitosamente`);

      setFormData({
        name: "",
        acronym: "",
        partyType: "",
        ideology: "",
        legalRepresentative: "",
        representativeId: "",
        email: "",
        foundationDate: "",
        isActive: true,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar partido";
      logger.error("FORM: Error al registrar partido", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#d4c5b0]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-[#3d2f1f]">
            Registrar Partido Político
          </h2>
          <p className="text-[#8b7355] mt-2">
            Complete los datos del partido político
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
                Nombre del Partido *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Partido Nacional"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Siglas *
              </label>
              <input
                type="text"
                value={formData.acronym}
                onChange={(e) =>
                  handleChange("acronym", e.target.value.toUpperCase())
                }
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="PN"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Tipo de Partido *
              </label>
              <select
                value={formData.partyType}
                onChange={(e) => handleChange("partyType", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="partido">Partido</option>
                <option value="coalicion">Coalición</option>
                <option value="movimiento">Movimiento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Ideología
              </label>
              <input
                type="text"
                value={formData.ideology}
                onChange={(e) => handleChange("ideology", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Conservador, Liberal, Centro, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Representante Legal *
              </label>
              <input
                type="text"
                value={formData.legalRepresentative}
                onChange={(e) =>
                  handleChange("legalRepresentative", e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Nombre completo del representante"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                ID del Representante *
              </label>
              <input
                type="text"
                value={formData.representativeId}
                onChange={(e) =>
                  handleChange("representativeId", e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Número de documento de identidad"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="correo@partido.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Fecha de Fundación
              </label>
              <input
                type="date"
                value={formData.foundationDate}
                onChange={(e) => handleChange("foundationDate", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-5 h-5 text-[#3d2f1f] border-2 border-[#e5ddd0] rounded focus:ring-[#8b7355] focus:ring-offset-2"
                />
                <span className="ml-3 text-sm font-medium text-[#3d2f1f]">
                  Partido Activo
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
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
                  Registrar Partido
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
