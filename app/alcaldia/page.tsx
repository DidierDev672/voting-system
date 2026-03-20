"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";
import { CreateAlcaldiaUseCase } from "./application/usecases/alcaldia.usecases";
import { DjangoAlcaldiaRepository } from "./infrastructure/adapters/django-alcaldia.repository";
import { DjangoPartyMembersRepository } from "./infrastructure/adapters/party-members.repository";

const alcaldiaRepository = new DjangoAlcaldiaRepository();
const partyMembersRepository = new DjangoPartyMembersRepository();
const createAlcaldiaUseCase = new CreateAlcaldiaUseCase(alcaldiaRepository);

interface PartyMember {
  id: string;
  fullName: string;
  documentNumber: string;
}

export default function RegisterAlcaldiaPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [formData, setFormData] = useState({
    nombre_entidad: "",
    nit: "",
    codigo_sigep: "",
    orden_entidad: "",
    municipio: "",
    direccion_fisica: "",
    dominio: "",
    correo_institucional: "",
    id_alcalde: "",
    nombre_alcalde: "",
    acto_posesion: "",
  });

  useEffect(() => {
    setMounted(true);
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);
      const data = await partyMembersRepository.getAll();
      setMembers(
        data.map((m) => ({
          id: m.id,
          fullName: m.fullName,
          documentNumber: m.documentNumber,
        })),
      );
    } catch (err) {
      console.error("Error loading members:", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAlcaldeSelect = (memberId: string) => {
    const selectedMember = members.find((m) => m.id === memberId);
    if (selectedMember) {
      setFormData((prev) => ({
        ...prev,
        id_alcalde: memberId,
        nombre_alcalde: selectedMember.fullName,
      }));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nombre_entidad) {
      setError("El nombre de la entidad es requerido");
      return;
    }
    if (!formData.nit) {
      setError("El NIT es requerido");
      return;
    }
    if (!formData.codigo_sigep) {
      setError("El código SIGEP es requerido");
      return;
    }
    if (!formData.orden_entidad) {
      setError("La orden de entidad es requerida");
      return;
    }
    if (!formData.municipio) {
      setError("El municipio es requerido");
      return;
    }
    if (!formData.direccion_fisica) {
      setError("La dirección física es requerida");
      return;
    }
    if (!formData.dominio) {
      setError("El dominio es requerido");
      return;
    }
    if (!formData.correo_institucional) {
      setError("El correo institucional es requerido");
      return;
    }
    if (!formData.id_alcalde) {
      setError("Debe seleccionar un alcalde");
      return;
    }
    if (!formData.acto_posesion) {
      setError("El acto de posesión es requerido");
      return;
    }

    setLoading(true);

    try {
      const result = await createAlcaldiaUseCase.execute(formData);
      setSuccess(`Alcaldía "${result.nombreEntidad}" registrada exitosamente`);

      setFormData({
        nombre_entidad: "",
        nit: "",
        codigo_sigep: "",
        orden_entidad: "",
        municipio: "",
        direccion_fisica: "",
        dominio: "",
        correo_institucional: "",
        id_alcalde: "",
        nombre_alcalde: "",
        acto_posesion: "",
      });

      setTimeout(() => {
        router.push("/alcaldia/list");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar la alcaldía",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push("/alcaldia/list")}
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

        <div className="bg-white rounded-lg shadow-lg border border-[#d4c5b0]">
          <div className="p-6 border-b border-[#e5ddd0]">
            <h1 className="text-2xl font-light text-[#3d2f1f]">
              Registrar Alcaldía
            </h1>
            <p className="text-[#8b7355] mt-1">
              Complete la información básica de la alcaldía
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Nombre de la Entidad *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_entidad}
                    onChange={(e) =>
                      handleChange("nombre_entidad", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    placeholder="Alcaldía Municipal de..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    NIT *
                  </label>
                  <input
                    type="text"
                    value={formData.nit}
                    onChange={(e) => handleChange("nit", e.target.value)}
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    placeholder="XX-XXXXXXX-X"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Código SIGEP *
                  </label>
                  <input
                    type="text"
                    value={formData.codigo_sigep}
                    onChange={(e) =>
                      handleChange("codigo_sigep", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    placeholder="SIGEP-XXXXXX"
                  />
                  <p className="text-xs text-[#8b7355] mt-1">
                    Identificador asignado por Función Pública
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Orden de la Entidad *
                  </label>
                  <select
                    value={formData.orden_entidad}
                    onChange={(e) =>
                      handleChange("orden_entidad", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Municipal">Municipal</option>
                    <option value="Distrital">Distrital</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Municipio *
                  </label>
                  <input
                    type="text"
                    value={formData.municipio}
                    onChange={(e) => handleChange("municipio", e.target.value)}
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    placeholder="Nombre del municipio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Dirección Física *
                  </label>
                  <input
                    type="text"
                    value={formData.direccion_fisica}
                    onChange={(e) =>
                      handleChange("direccion_fisica", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    placeholder="Dirección de la alcaldía"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Dominio *
                  </label>
                  <input
                    type="text"
                    value={formData.dominio}
                    onChange={(e) => handleChange("dominio", e.target.value)}
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    placeholder="alcaldia.gov.co"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Correo Institucional *
                  </label>
                  <input
                    type="email"
                    value={formData.correo_institucional}
                    onChange={(e) =>
                      handleChange("correo_institucional", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    placeholder="contacto@alcaldia.gov.co"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Nombre del Alcalde *
                  </label>
                  {loadingMembers ? (
                    <div className="flex items-center justify-center h-10 border border-[#d4c5b0] rounded-lg">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3d2f1f]"></div>
                    </div>
                  ) : (
                    <select
                      value={formData.id_alcalde}
                      onChange={(e) => handleAlcaldeSelect(e.target.value)}
                      className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    >
                      <option value="">Seleccionar alcalde...</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.fullName} - {member.documentNumber}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-xs text-[#8b7355] mt-1">
                    Debe estar registrado en los miembros
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                    Acto de Posesión *
                  </label>
                  <input
                    type="text"
                    value={formData.acto_posesion}
                    onChange={(e) =>
                      handleChange("acto_posesion", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-[#d4c5b0] rounded-lg text-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#3d2f1f]"
                    placeholder="Acta 001 de 2024"
                  />
                  <p className="text-xs text-[#8b7355] mt-1">
                    Número de acta o decreto de inicio de periodo
                  </p>
                </div>
              </div>

              {formData.nombre_alcalde && (
                <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e5ddd0]">
                  <p className="text-sm text-[#8b7355]">
                    <span className="font-medium">Alcalde seleccionado:</span>{" "}
                    {formData.nombre_alcalde}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push("/alcaldia/list")}
                className="px-6 py-2 border border-[#d4c5b0] text-[#8b7355] rounded-lg hover:bg-[#faf8f5] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar Alcaldía"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
