"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bancada,
  CreateBancadaDTO,
  TIPO_CURUL_OPTIONS,
  COMISION_OPTIONS,
} from "../../../core/domain/types/bancada";
import { CreateBancadaUseCase } from "../../../core/application/usecases/bancada.usecases";
import { bancadaRepository } from "../../adapters/django-bancada.repository";
import { getMiembros, Miembro } from "../../adapters/miembro.adapter";
import { getPartidos, Partido } from "../../adapters/partido.adapter";
import { logger } from "@/app/core/infrastructure/logger/logger";

interface RegisterBancadaFormProps {
  initialData?: Partial<Bancada>;
  isEdit?: boolean;
  bancadaId?: string;
}

const createBancadaUseCase = new CreateBancadaUseCase(bancadaRepository);

export default function RegisterBancadaForm({
  initialData,
  isEdit = false,
  bancadaId,
}: RegisterBancadaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);

  const [formData, setFormData] = useState<CreateBancadaDTO>({
    id_miembro: initialData?.id_miembro || "",
    id_partido: initialData?.id_partido || "",
    tipo_curul: initialData?.tipo_curul || "Ordinaria",
    fin_periodo: initialData?.fin_periodo || "",
    declaraciones_bienes: initialData?.declaraciones_bienes || "",
    antecedentes_siri_sirus:
      initialData?.antecedentes_siri_sirus || "Sin antecedentes",
    comision_permanente:
      initialData?.comision_permanente || "Comisión de Gobierno",
    correo_institucional: initialData?.correo_institucional || "",
    profesion: initialData?.profesion || "",
  });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setLoadingData(true);
      const [miembrosData, partidosData] = await Promise.all([
        getMiembros(),
        getPartidos(),
      ]);
      setMiembros(miembrosData);
      setPartidos(partidosData);
    } catch (err) {
      logger.error("Error cargando opciones", { error: err });
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      logger.info("Registrando bancada...", { data: formData });
      await createBancadaUseCase.execute(formData);
      setSuccess(true);
      logger.success("Bancada registrada exitosamente");

      setTimeout(() => {
        router.push("/bancadas/list");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      logger.error("Error al registrar bancada", { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#d4c5b0]">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-[#3d2f1f]">
            {isEdit
              ? "Editar Bancada"
              : "Registrar Bancada del Consejo Municipal"}
          </h2>
          <p className="text-[#8b7355] mt-2 text-sm">
            Complete todos los campos requeridos para registrar la bancada
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">
              Bancada registrada exitosamente. Redirigiendo...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#8b7355] mb-2">
                Miembro del Consejo *
              </label>
              <select
                name="id_miembro"
                value={formData.id_miembro}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
                required
              >
                <option value="">Seleccione un miembro...</option>
                {miembros.map((miembro) => (
                  <option key={miembro.id} value={miembro.id}>
                    {miembro.full_name} - {miembro.document_number}
                  </option>
                ))}
              </select>
              {miembros.length === 0 && (
                <p className="text-xs text-[#b8a896] mt-1">
                  No hay miembros registrados
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8b7355] mb-2">
                Partido Político *
              </label>
              <select
                name="id_partido"
                value={formData.id_partido}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
                required
              >
                <option value="">Seleccione un partido...</option>
                {partidos.map((partido) => (
                  <option key={partido.id} value={partido.id}>
                    {partido.name} ({partido.acronym})
                  </option>
                ))}
              </select>
              {partidos.length === 0 && (
                <p className="text-xs text-[#b8a896] mt-1">
                  No hay partidos registrados
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#8b7355] mb-2">
                Tipo de Curul *
              </label>
              <select
                name="tipo_curul"
                value={formData.tipo_curul}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
                required
              >
                {TIPO_CURUL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8b7355] mb-2">
                Fecha Fin de Período *
              </label>
              <input
                type="date"
                name="fin_periodo"
                value={formData.fin_periodo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8b7355] mb-2">
              Comisión Permanente *
            </label>
            <select
              name="comision_permanente"
              value={formData.comision_permanente}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
              required
            >
              {COMISION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#8b7355] mb-2">
                Correo Institucional *
              </label>
              <input
                type="email"
                name="correo_institucional"
                value={formData.correo_institucional}
                onChange={handleChange}
                placeholder="correo@concejomunicipal.gov.co"
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8b7355] mb-2">
                Profesión *
              </label>
              <input
                type="text"
                name="profesion"
                value={formData.profesion}
                onChange={handleChange}
                placeholder="Abogado, Economista, etc."
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8b7355] mb-2">
              Declaraciones de Bienes
            </label>
            <textarea
              name="declaraciones_bienes"
              value={formData.declaraciones_bienes}
              onChange={handleChange}
              rows={3}
              placeholder="Detalles de la declaración de bienes..."
              className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8b7355] mb-2">
              Antecedentes SIRI/SIRHUS
            </label>
            <input
              type="text"
              name="antecedentes_siri_sirus"
              value={formData.antecedentes_siri_sirus}
              onChange={handleChange}
              placeholder="Sin antecedentes, En verificación, etc."
              className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Guardando...
                </span>
              ) : isEdit ? (
                "Actualizar Bancada"
              ) : (
                "Registrar Bancada"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-[#f5f1eb] text-[#3d2f1f] rounded-lg hover:bg-[#e5ddd0] transition-colors border border-[#e5ddd0]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
