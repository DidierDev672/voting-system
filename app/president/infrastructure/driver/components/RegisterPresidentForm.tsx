"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { DjangoMunicipalCouncilPresidentRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-president.repository";
import { DjangoPartyRepository } from "@/app/core/infrastructure/adapters/django-party.repository";
import { CreateMunicipalCouncilPresidentUseCase } from "@/app/core/application/usecases/municipal-council-president.usecases";
import { PoliticalParty } from "@/app/core/domain/types/party";
import { DocumentType, PresidencyType } from "@/app/core/domain/types/municipal-council-president";
import { logger } from "@/app/core/infrastructure/logger/logger";

const presidentRepository = new DjangoMunicipalCouncilPresidentRepository();
const partyRepository = new DjangoPartyRepository();
const createPresidentUseCase = new CreateMunicipalCouncilPresidentUseCase(presidentRepository);

interface SignatureCanvasProps {
  value: string;
  onChange: (value: string) => void;
}

function SignatureCanvas({ value, onChange }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#3d2f1f";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasImage(true);
      };
      img.src = value;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasImage(false);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      onChange(dataUrl);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
    setHasImage(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange(result);
      setHasImage(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        className="border-2 border-[#e5ddd0] rounded-lg bg-white touch-none cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={clearCanvas}
          className="text-sm px-3 py-1 text-[#8b7355] hover:text-[#3d2f1f] transition-colors"
        >
          Limpiar
        </button>
        <label className="text-sm px-3 py-1 text-[#8b7355] hover:text-[#3d2f1f] cursor-pointer transition-colors">
          Subir imagen
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

export default function RegisterPresidentForm() {
  const [mounted, setMounted] = useState(false);
  const [parties, setParties] = useState<PoliticalParty[]>([]);
  const [loadingParties, setLoadingParties] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    documentType: "" as DocumentType | "",
    documentId: "",
    boardPosition: "",
    politicalPartyId: "",
    electionPeriod: "",
    presidencyType: "" as PresidencyType | "",
    positionTime: "",
    institutionalEmail: "",
    digitalSignature: "",
    fingerprint: "",
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

    logger.info("FORM: Iniciando registro de presidente de consejo municipal", {
      fullName: formData.fullName,
    });

    try {
      const result = await createPresidentUseCase.execute({
        full_name: formData.fullName,
        document_type: formData.documentType,
        document_id: formData.documentId,
        board_position: formData.boardPosition,
        political_party: formData.politicalPartyId,
        election_period: formData.electionPeriod,
        presidency_type: formData.presidencyType,
        position_time: formData.positionTime,
        institutional_email: formData.institutionalEmail,
        digital_signature: formData.digitalSignature || undefined,
        fingerprint: formData.fingerprint || undefined,
      });

      logger.success("FORM: Presidente registrado exitosamente", {
        id: result.id,
      });
      setSuccess(`Presidente "${result.fullName}" registrado exitosamente`);

      setFormData({
        fullName: "",
        documentType: "",
        documentId: "",
        boardPosition: "",
        politicalPartyId: "",
        electionPeriod: "",
        presidencyType: "",
        positionTime: "",
        institutionalEmail: "",
        digitalSignature: "",
        fingerprint: "",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar presidente";
      logger.error("FORM: Error al registrar presidente", { error: errorMessage });
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
            Registrar Presidente de Consejo Municipal
          </h2>
          <p className="text-[#8b7355] mt-2">
            Complete los datos del presidente de consejo municipal
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
                placeholder="Nombre completo del presidente"
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
                <option value="CI">Cédula de Ciudadanía (CI)</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Licencia">Licencia de Conducción</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Documento de Identidad *
              </label>
              <input
                type="text"
                value={formData.documentId}
                onChange={(e) => handleChange("documentId", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Número de documento"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Cargo de la Mesa *
              </label>
              <input
                type="text"
                value={formData.boardPosition}
                onChange={(e) => handleChange("boardPosition", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Cargo en la mesa de votación"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Período de Elección *
              </label>
              <input
                type="text"
                value={formData.electionPeriod}
                onChange={(e) => handleChange("electionPeriod", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ej: 2024-2028"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Calidad de Presidencia *
              </label>
              <select
                value={formData.presidencyType}
                onChange={(e) => handleChange("presidencyType", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Propietario">Propietario</option>
                <option value="Suplente">Suplente</option>
                <option value="Interino">Interino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Hora de Toma de Posición *
              </label>
              <input
                type="text"
                value={formData.positionTime}
                onChange={(e) => handleChange("positionTime", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ej: 08:00 AM"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Correo Institucional *
            </label>
            <input
              type="email"
              value={formData.institutionalEmail}
              onChange={(e) => handleChange("institutionalEmail", e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
              placeholder="correo@Institución.gob"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Firma Digital
              </label>
              <p className="text-xs text-[#8b7355] mb-2">
                Dibuje su firma o sube una imagen
              </p>
              <SignatureCanvas
                value={formData.digitalSignature}
                onChange={(value) => handleChange("digitalSignature", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Huella Digital
              </label>
              <p className="text-xs text-[#8b7355] mb-2">
                Suba una imagen de su huella digital
              </p>
              <label className="flex flex-col items-center justify-center w-full h-[100px] border-2 border-[#e5ddd0] border-dashed rounded-lg cursor-pointer bg-[#faf8f5] hover:bg-[#f5efe8] transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-2 text-[#8b7355]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-xs text-[#8b7355]">
                    Click para subir imagen
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handleChange("fingerprint", event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {formData.fingerprint && (
                <p className="text-xs text-[#4ade80] mt-1">Imagen cargada</p>
              )}
            </div>
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
                  Registrar Presidente
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
