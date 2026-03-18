"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bancada, CreateBancadaDTO, TIPO_CURUL_OPTIONS, COMISION_OPTIONS } from "../core/domain/types/bancada";
import { GetBancadaByIdUseCase, UpdateBancadaUseCase } from "../core/application/usecases/bancada.usecases";
import { bancadaRepository } from "../infrastructure/adapters/django-bancada.repository";
import { getMiembros, Miembro } from "../infrastructure/adapters/miembro.adapter";
import { getPartidos, Partido } from "../infrastructure/adapters/partido.adapter";
import { logger } from "@/app/core/infrastructure/logger/logger";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";

const getBancadaByIdUseCase = new GetBancadaByIdUseCase(bancadaRepository);
const updateBancadaUseCase = new UpdateBancadaUseCase(bancadaRepository);

export default function EditBancadaPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bancada, setBancada] = useState<Bancada | null>(null);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);

  const [formData, setFormData] = useState<CreateBancadaDTO>({
    id_miembro: "",
    id_partido: "",
    tipo_curul: "Ordinaria",
    fin_periodo: "",
    declaraciones_bienes: "",
    antecedentes_siri_sirus: "Sin antecedentes",
    comision_permanente: "Comisión de Gobierno",
    correo_institucional: "",
    profesion: "",
  });

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoadingData(true);
      
      const [bancadaData, miembrosData, partidosData] = await Promise.all([
        getBancadaByIdUseCase.execute(params.id as string),
        getMiembros(),
        getPartidos(),
      ]);
      
      setMiembros(miembrosData);
      setPartidos(partidosData);
      
      if (bancadaData) {
        setBancada(bancadaData);
        setFormData({
          id_miembro: bancadaData.id_miembro,
          id_partido: bancadaData.id_partido,
          tipo_curul: bancadaData.tipo_curul,
          fin_periodo: bancadaData.fin_periodo,
          declaraciones_bienes: bancadaData.declaraciones_bienes,
          antecedentes_siri_sirus: bancadaData.antecedentes_siri_sirus,
          comision_permanente: bancadaData.comision_permanente,
          correo_institucional: bancadaData.correo_institucional,
          profesion: bancadaData.profesion,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar данные";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      logger.info("Actualizando bancada...", { id: params.id, data: formData });
      await updateBancadaUseCase.execute(params.id as string, formData);
      logger.success("Bancada actualizada exitosamente");
      router.push("/bancadas/list");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      logger.error("Error al actualizar bancada", { error: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!bancada) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-[#8b7355] mb-4">Bancada no encontrada</p>
          <button
            onClick={() => router.push("/bancadas/list")}
            className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-[#d4c5b0]">
          <div className="mb-8">
            <h2 className="text-2xl font-light text-[#3d2f1f]">Editar Bancada</h2>
            <p className="text-[#8b7355] mt-2 text-sm">
              Actualice los datos de la bancada del consejo municipal
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
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
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
                  required
                >
                  <option value="">Seleccione un miembro...</option>
                  {miembros.map((miembro) => (
                    <option key={miembro.id} value={miembro.id}>
                      {miembro.full_name} - {miembro.document_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8b7355] mb-2">
                  Partido Político *
                </label>
                <select
                  name="id_partido"
                  value={formData.id_partido}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
                  required
                >
                  <option value="">Seleccione un partido...</option>
                  {partidos.map((partido) => (
                    <option key={partido.id} value={partido.id}>
                      {partido.name} ({partido.acronym})
                    </option>
                  ))}
                </select>
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
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
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
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
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
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
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
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
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
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
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
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all resize-none"
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
                className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Actualizar Bancada"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/bancadas/list")}
                className="px-6 py-3 bg-[#f5f1eb] text-[#3d2f1f] rounded-lg hover:bg-[#e5ddd0] transition-colors border border-[#e5ddd0]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
