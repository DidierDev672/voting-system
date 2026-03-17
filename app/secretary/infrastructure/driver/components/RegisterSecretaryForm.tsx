"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { DjangoMunicipalCouncilSecretaryRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-secretary.repository";
import { CreateMunicipalCouncilSecretaryUseCase } from "@/app/core/application/usecases/municipal-council-secretary.usecases";
import { DocumentType, ExactPosition, PerformanceType } from "@/app/core/domain/types/municipal-council-secretary";
import { logger } from "@/app/core/infrastructure/logger/logger";

const secretaryRepository = new DjangoMunicipalCouncilSecretaryRepository();
const createSecretaryUseCase = new CreateMunicipalCouncilSecretaryUseCase(secretaryRepository);

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

export default function RegisterSecretaryForm() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    documentType: "" as DocumentType | "",
    documentId: "",
    exactPosition: "" as ExactPosition | "",
    administrativeAct: "",
    possessionDate: "",
    legalPeriod: "",
    professionalTitle: "",
    performanceType: "" as PerformanceType | "",
    institutionalEmail: "",
    digitalSignature: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    logger.info("FORM: Iniciando registro de secretario de consejo municipal", {
      fullName: formData.fullName,
    });

    try {
      const result = await createSecretaryUseCase.execute({
        full_name: formData.fullName,
        document_type: formData.documentType,
        document_id: formData.documentId,
        exact_position: formData.exactPosition,
        administrative_act: formData.administrativeAct,
        possession_date: formData.possessionDate,
        legal_period: formData.legalPeriod,
        professional_title: formData.professionalTitle || undefined,
        performance_type: formData.performanceType,
        institutional_email: formData.institutionalEmail,
        digital_signature: formData.digitalSignature || undefined,
      });

      logger.success("FORM: Secretario registrado exitosamente", {
        id: result.id,
      });
      setSuccess(`Secretario "${result.fullName}" registrado exitosamente`);

      setFormData({
        fullName: "",
        documentType: "",
        documentId: "",
        exactPosition: "",
        administrativeAct: "",
        possessionDate: "",
        legalPeriod: "",
        professionalTitle: "",
        performanceType: "",
        institutionalEmail: "",
        digitalSignature: "",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar secretario";
      logger.error("FORM: Error al registrar secretario", { error: errorMessage });
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
            Registrar Secretario de Consejo Municipal
          </h2>
          <p className="text-[#8b7355] mt-2">
            Complete los datos del secretario de consejo municipal
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
                placeholder="Nombre completo del secretario"
                required
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Número de Documento *
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

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Cargo Exacto *
              </label>
              <select
                value={formData.exactPosition}
                onChange={(e) => handleChange("exactPosition", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              >
                <option value="">Seleccionar cargo</option>
                <option value="Secretario General">Secretario General</option>
                <option value="Secretario de comision">Secretario de Comisión</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Acto Administrativo de Elección *
              </label>
              <input
                type="text"
                value={formData.administrativeAct}
                onChange={(e) => handleChange("administrativeAct", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ej: Acuerdo Municipal 045/2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Fecha de Posesión *
              </label>
              <input
                type="date"
                value={formData.possessionDate}
                onChange={(e) => handleChange("possessionDate", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Período Legal *
              </label>
              <input
                type="text"
                value={formData.legalPeriod}
                onChange={(e) => handleChange("legalPeriod", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ej: 2024-2027"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Título Profesional
              </label>
              <input
                type="text"
                value={formData.professionalTitle}
                onChange={(e) => handleChange("professionalTitle", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Ej: Abogado, Administrador"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Calidad de Actuación *
              </label>
              <select
                value={formData.performanceType}
                onChange={(e) => handleChange("performanceType", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="ad-hoc">Ad-hoc</option>
                <option value="temporal">Temporal</option>
              </select>
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
                placeholder="correo@secretariamunicipal.gov"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Firma Digital
            </label>
            <p className="text-xs text-[#8b7355] mb-2">
              Dibuje su firma o suba una imagen
            </p>
            <SignatureCanvas
              value={formData.digitalSignature}
              onChange={(value) => handleChange("digitalSignature", value)}
            />
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
                  Registrar Secretario
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
