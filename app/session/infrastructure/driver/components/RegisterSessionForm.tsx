"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
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

interface AvailableMember {
  id: string;
  fullName: string;
  documentNumber: string;
}

interface AvailableBancada {
  id: string;
  tipoCurul: string;
  profesion: string;
}

export default function RegisterSessionForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [presidents, setPresidents] = useState<PresidentOption[]>([]);
  const [secretaries, setSecretaries] = useState<SecretaryOption[]>([]);
  const [allMembers, setAllMembers] = useState<AvailableMember[]>([]);
  const [allBancadas, setAllBancadas] = useState<AvailableBancada[]>([]);
  const [loadingPresidents, setLoadingPresidents] = useState(true);
  const [loadingSecretaries, setLoadingSecretaries] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
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
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedBancadas, setSelectedBancadas] = useState<string[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showBancadasModal, setShowBancadasModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPresidents();
    loadSecretaries();
    loadAllMembersAndBancadas();
    
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

  const loadAllMembersAndBancadas = async () => {
    try {
      setLoadingData(true);
      const [members, bancadas] = await Promise.all([
        sessionRepository.getAllMembers(),
        sessionRepository.getAllBancadas()
      ]);
      setAllMembers(members);
      setAllBancadas(bancadas);
    } catch (err) {
      logger.error("FORM: Error al cargar miembros y bancadas", {
        error: err instanceof Error ? err.message : err,
      });
    } finally {
      setLoadingData(false);
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
        titleSession: result.titleSession,
      });

      console.log("=== DEBUG: result.id ===", result.id);
      console.log("=== DEBUG: selectedMembers ===", selectedMembers);
      console.log("=== DEBUG: selectedBancadas ===", selectedBancadas);

      let failedMembers = 0;
      let failedBancadas = 0;

      for (const memberId of selectedMembers) {
        console.log(`=== DEBUG: Adding member ${memberId} to session ${result.id} ===`);
        try {
          await sessionRepository.addMember(result.id!, memberId);
          console.log(`=== DEBUG: Member ${memberId} added successfully ===`);
          logger.success("FORM: Miembro agregado", { memberId });
        } catch (err) {
          failedMembers++;
          console.error(`=== DEBUG: Error adding member ${memberId}:`, err);
          logger.error("FORM: Error al agregar miembro", { memberId, error: err instanceof Error ? err.message : err });
        }
      }

      for (const bancadaId of selectedBancadas) {
        console.log(`=== DEBUG: Adding bancada ${bancadaId} to session ${result.id} ===`);
        try {
          await sessionRepository.addBancada(result.id!, bancadaId);
          console.log(`=== DEBUG: Bancada ${bancadaId} added successfully ===`);
          logger.success("FORM: Bancada agregada", { bancadaId });
        } catch (err) {
          failedBancadas++;
          console.error(`=== DEBUG: Error adding bancada ${bancadaId}:`, err);
          logger.error("FORM: Error al agregar bancada", { bancadaId, error: err instanceof Error ? err.message : err });
        }
      }

      if (failedMembers > 0 || failedBancadas > 0) {
        setSuccess(`Sesion "${result.titleSession}" registrada exitosamente. Miembros agregados: ${selectedMembers.length - failedMembers}/${selectedMembers.length}, Bancadas agregadas: ${selectedBancadas.length - failedBancadas}/${selectedBancadas.length}`);
      } else {
        setSuccess(`Sesion "${result.titleSession}" registrada exitosamente con ${selectedMembers.length} miembros y ${selectedBancadas.length} bancadas`);
      }

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
      setSelectedMembers([]);
      setSelectedBancadas([]);

      setTimeout(() => {
        router.push("/session/list");
      }, 2000);
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

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleBancada = (bancadaId: string) => {
    setSelectedBancadas(prev => 
      prev.includes(bancadaId) 
        ? prev.filter(id => id !== bancadaId)
        : [...prev, bancadaId]
    );
  };

  const getMemberName = (memberId: string) => {
    const member = allMembers.find(m => m.id === memberId);
    return member ? `${member.fullName} (${member.documentNumber})` : memberId;
  };

  const getBancadaName = (bancadaId: string) => {
    const bancada = allBancadas.find(b => b.id === bancadaId);
    return bancada ? `${bancada.profesion} - ${bancada.tipoCurul}` : bancadaId;
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

          <div className="border-t-2 border-[#e5ddd0] pt-6">
            <h3 className="text-lg font-medium text-[#3d2f1f] mb-4">Miembros y Bancadas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e5ddd0]">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-[#3d2f1f]">
                    Miembros ({selectedMembers.length})
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      await loadAllMembersAndBancadas();
                      setShowMembersModal(true);
                    }}
                    className="px-3 py-1 text-xs bg-[#3d2f1f] text-white rounded hover:bg-[#5a4332] transition-colors"
                  >
                    + Seleccionar
                  </button>
                </div>
                
                {selectedMembers.length === 0 ? (
                  <p className="text-sm text-[#8b7355] italic">No hay miembros seleccionados</p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedMembers.map((memberId) => (
                      <div key={memberId} className="flex justify-between items-center p-2 bg-white rounded border border-[#d4c5b0]">
                        <span className="text-sm text-[#3d2f1f] truncate flex-1">{getMemberName(memberId)}</span>
                        <button
                          type="button"
                          onClick={() => toggleMember(memberId)}
                          className="ml-2 text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e5ddd0]">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-[#3d2f1f]">
                    Bancadas ({selectedBancadas.length})
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      await loadAllMembersAndBancadas();
                      setShowBancadasModal(true);
                    }}
                    className="px-3 py-1 text-xs bg-[#3d2f1f] text-white rounded hover:bg-[#5a4332] transition-colors"
                  >
                    + Seleccionar
                  </button>
                </div>
                
                {selectedBancadas.length === 0 ? (
                  <p className="text-sm text-[#8b7355] italic">No hay bancadas seleccionadas</p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedBancadas.map((bancadaId) => (
                      <div key={bancadaId} className="flex justify-between items-center p-2 bg-white rounded border border-[#d4c5b0]">
                        <span className="text-sm text-[#3d2f1f] truncate flex-1">{getBancadaName(bancadaId)}</span>
                        <button
                          type="button"
                          onClick={() => toggleBancada(bancadaId)}
                          className="ml-2 text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registrando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Registrar Sesion
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {showMembersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-[#e5ddd0]">
              <h3 className="text-lg font-medium text-[#3d2f1f]">Seleccionar Miembros</h3>
              <p className="text-sm text-[#8b7355]">Marque los miembros que desea agregar a la sesion</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {loadingData ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2f1f]"></div>
                </div>
              ) : allMembers.length === 0 ? (
                <p className="text-center text-[#8b7355] py-4">No hay miembros disponibles</p>
              ) : (
                <div className="space-y-2">
                  {allMembers.map((member) => (
                    <label
                      key={member.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMembers.includes(member.id)
                          ? 'bg-[#e6f5e6] border border-green-300'
                          : 'bg-[#faf8f5] border border-[#e5ddd0] hover:bg-[#f5f1eb]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleMember(member.id)}
                        className="w-4 h-4 text-[#3d2f1f] rounded border-[#d4c5b0] focus:ring-[#8b7355]"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-[#3d2f1f]">{member.fullName}</p>
                        <p className="text-sm text-[#8b7355]">{member.documentNumber}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#e5ddd0]">
              <button
                onClick={() => setShowMembersModal(false)}
                className="w-full py-3 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
              >
                Aceptar ({selectedMembers.length} seleccionados)
              </button>
            </div>
          </div>
        </div>
      )}

      {showBancadasModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-[#e5ddd0]">
              <h3 className="text-lg font-medium text-[#3d2f1f]">Seleccionar Bancadas</h3>
              <p className="text-sm text-[#8b7355]">Marque las bancadas que desea agregar a la sesion</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {loadingData ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d2f1f]"></div>
                </div>
              ) : allBancadas.length === 0 ? (
                <p className="text-center text-[#8b7355] py-4">No hay bancadas disponibles</p>
              ) : (
                <div className="space-y-2">
                  {allBancadas.map((bancada) => (
                    <label
                      key={bancada.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedBancadas.includes(bancada.id)
                          ? 'bg-[#e6f5e6] border border-green-300'
                          : 'bg-[#faf8f5] border border-[#e5ddd0] hover:bg-[#f5f1eb]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBancadas.includes(bancada.id)}
                        onChange={() => toggleBancada(bancada.id)}
                        className="w-4 h-4 text-[#3d2f1f] rounded border-[#d4c5b0] focus:ring-[#8b7355]"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-[#3d2f1f]">{bancada.profesion}</p>
                        <p className="text-sm text-[#8b7355]">{bancada.tipoCurul}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#e5ddd0]">
              <button
                onClick={() => setShowBancadasModal(false)}
                className="w-full py-3 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
              >
                Aceptar ({selectedBancadas.length} seleccionadas)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
