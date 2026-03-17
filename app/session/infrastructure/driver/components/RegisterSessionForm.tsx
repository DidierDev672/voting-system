"use client";

import { useState, useEffect, FormEvent } from "react";
import { DjangoMunicipalCouncilSessionRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-session.repository";
import { DjangoMunicipalCouncilPresidentRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-president.repository";
import { DjangoMunicipalCouncilSecretaryRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-secretary.repository";
import { CreateMunicipalCouncilSessionUseCase } from "@/app/core/application/usecases/municipal-council-session.usecases";
import { MunicipalCouncilPresident } from "@/app/core/domain/types/municipal-council-president";
import { MunicipalCouncilSecretary } from "@/app/core/domain/types/municipal-council-secretary";
import { TypeSession, StatusSession, Modality } from "@/app/core/domain/types/municipal-council-session";
import { logger } from "@/app/core/infrastructure/logger/logger";

const sessionRepository = new DjangoMunicipalCouncilSessionRepository();
const presidentRepository = new DjangoMunicipalCouncilPresidentRepository();
const secretaryRepository = new DjangoMunicipalCouncilSecretaryRepository();
const createSessionUseCase = new CreateMunicipalCouncilSessionUseCase(sessionRepository);

interface PresidentOption {
  id: string;
  fullName: string;
}

interface SecretaryOption {
  id: string;
  fullName: string;
}

export default function RegisterSessionForm() {
  const [mounted, setMounted] = useState(false);
  const [presidents, setPresidents] = useState<PresidentOption[]>([]);
  const [secretaries, setSecretaries] = useState<SecretaryOption[]>([]);
  const [loadingPresidents, setLoadingPresidents] = useState(true);
  const [loadingSecretaries, setLoadingSecretaries] = useState(true);
  const [formData, setFormData] = useState({
    titleSession: "",
    typeSession: "" as TypeSession | "",
    statusSession: "" as StatusSession | "",
    dateHourStart: "",
    dateHourEnd: "",
    modality: "" as Modality | "",
    placeEnclosure: "",
    ordenDay: "",
    quorumRequired: "",
    idPresident: "",
    idSecretary: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPresidents();
    loadSecretaries();
    
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      setFormData(prev => ({
        ...prev,
        dateHourStart: dateParam,
        dateHourEnd: dateParam,
      }));
    }
  }, []);

  const loadPresidents = async () => {
    try {
      setLoadingPresidents(true);
      const data = await presidentRepository.getAll();
      setPresidents(data.map((p: MunicipalCouncilPresident) => ({ id: p.id, fullName: p.fullName })));
    } catch (err) {
      logger.error("FORM: Error al cargar presidentes", {
        error: err instanceof Error ? err.message : err,
      });
    } finally {
      setLoadingPresidents(false);
    }
  };

  const loadSecretaries = async () => {
    try {
      setLoadingSecretaries(true);
      const data = await secretaryRepository.getAll();
      setSecretaries(data.map((s: MunicipalCouncilSecretary) => ({ id: s.id, fullName: s.fullName })));
    } catch (err) {
      logger.error("FORM: Error al cargar secretarios", {
        error: err instanceof Error ? err.message : err,
      });
    } finally {
      setLoadingSecretaries(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    logger.info("FORM: Iniciando registro de sesion de consejo municipal", {
      titleSession: formData.titleSession,
    });

    try {
      const result = await createSessionUseCase.execute({
        title_session: formData.titleSession,
        type_session: formData.typeSession,
        status_session: formData.statusSession,
        date_hour_start: formData.dateHourStart,
        date_hour_end: formData.dateHourEnd,
        modality: formData.modality,
        place_enclosure: formData.placeEnclosure,
        orden_day: formData.ordenDay,
        quorum_required: parseInt(formData.quorumRequired),
        id_president: formData.idPresident,
        id_secretary: formData.idSecretary,
      });

      logger.success("FORM: Sesion registrada exitosamente", {
        id: result.id,
      });
      setSuccess(`Sesion "${result.titleSession}" registrada exitosamente`);

      setFormData({
        titleSession: "",
        typeSession: "",
        statusSession: "",
        dateHourStart: "",
        dateHourEnd: "",
        modality: "",
        placeEnclosure: "",
        ordenDay: "",
        quorumRequired: "",
        idPresident: "",
        idSecretary: "",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar sesion";
      logger.error("FORM: Error al registrar sesion", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
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
            Registrar Sesion de Consejo Municipal
          </h2>
          <p className="text-[#8b7355] mt-2">
            Complete los datos de la sesion del consejo municipal
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
                Titulo de la Sesion *
              </label>
              <input
                type="text"
                value={formData.titleSession}
                onChange={(e) => handleChange("titleSession", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ej: Sesion Ordinaria - Marzo 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Tipo de Sesion *
              </label>
              <select
                value={formData.typeSession}
                onChange={(e) => handleChange("typeSession", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Ordinaria">Ordinaria</option>
                <option value="Extraordinaria">Extraordinaria</option>
                <option value="Especial">Especial</option>
                <option value="Instalacion">Instalacion</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Estado de la Sesion *
              </label>
              <select
                value={formData.statusSession}
                onChange={(e) => handleChange("statusSession", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              >
                <option value="">Seleccionar estado</option>
                <option value="Convocada">Convocada</option>
                <option value="En progreso">En progreso</option>
                <option value="Realizada">Realizada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Postergada">Postergada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Modalidad *
              </label>
              <select
                value={formData.modality}
                onChange={(e) => handleChange("modality", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              >
                <option value="">Seleccionar modalidad</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual (bajo decreto)</option>
                <option value="hibrida">Hibrida</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Fecha y Hora de Inicio *
              </label>
              <input
                type="datetime-local"
                value={formData.dateHourStart}
                onChange={(e) => handleChange("dateHourStart", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Fecha y Hora de Fin *
              </label>
              <input
                type="datetime-local"
                value={formData.dateHourEnd}
                onChange={(e) => handleChange("dateHourEnd", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Lugar de Enclosure *
              </label>
              <input
                type="text"
                value={formData.placeEnclosure}
                onChange={(e) => handleChange("placeEnclosure", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ej: Salon de Sesiones - Palacio Municipal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Quorum Requerido *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quorumRequired}
                onChange={(e) => handleChange("quorumRequired", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ej: 7"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Orden del Dia *
            </label>
            <textarea
              value={formData.ordenDay}
              onChange={(e) => handleChange("ordenDay", e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
              placeholder="1. Lectura de actas anteriores&#10;2. Informe de gestion&#10;3. Aprobacion de presupuesto&#10;4. Varios"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Presidente del Consejo *
              </label>
              <select
                value={formData.idPresident}
                onChange={(e) => handleChange("idPresident", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
                disabled={loadingPresidents}
              >
                <option value="">
                  {loadingPresidents ? "Cargando..." : "Seleccionar presidente"}
                </option>
                {presidents.map((president) => (
                  <option key={president.id} value={president.id}>
                    {president.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Secretario del Consejo *
              </label>
              <select
                value={formData.idSecretary}
                onChange={(e) => handleChange("idSecretary", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
                disabled={loadingSecretaries}
              >
                <option value="">
                  {loadingSecretaries ? "Cargando..." : "Seleccionar secretario"}
                </option>
                {secretaries.map((secretary) => (
                  <option key={secretary.id} value={secretary.id}>
                    {secretary.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || loadingPresidents || loadingSecretaries}
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
                  Registrar Sesion
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
