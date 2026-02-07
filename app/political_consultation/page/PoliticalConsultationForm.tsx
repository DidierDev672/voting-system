'use client';
import { useForm } from 'react-hook-form';

export default function PoliticalConsultationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Datos de consulta:', data);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
        {/* Header principal con tema de democracia participativa */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
            <div className="w-20 h-0.5 bg-[#e5ddd0] mx-2"></div>
            <svg
              className="w-8 h-8 text-[#3d2f1f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="w-20 h-0.5 bg-[#e5ddd0] mx-2"></div>
            <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
          </div>

          <h2 className="text-3xl md:text-4xl font-light text-[#3d2f1f] tracking-wide mb-3">
            Crear Consulta Popular
          </h2>
          <p className="text-[#8b7355] font-light max-w-lg mx-auto leading-relaxed">
            Mecanismo de participación ciudadana para decisiones de interés
            público
          </p>

          {/* Badge informativo */}
          <div className="inline-flex items-center space-x-2 mt-6 px-4 py-2 bg-white border border-[#e5ddd0] rounded-full">
            <svg
              className="w-4 h-4 text-[#8b7355]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-light text-[#3d2f1f]">
              Constitución Política - Art. 103
            </span>
          </div>
        </div>

        {/* Sección: Información de la Consulta */}
        <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0] mb-6">
          <div className="flex items-center mb-6 pb-4 border-b border-[#e5ddd0]">
            <div className="w-10 h-10 bg-[#f5f1eb] rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-[#8b7355]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#3d2f1f] tracking-wide">
              Información de la Consulta
            </h3>
          </div>

          <div className="space-y-5">
            {/* Título de la consulta */}
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                Título de la Consulta
              </label>
              <input
                type="text"
                {...register('title', {
                  required: 'El título es obligatorio',
                })}
                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355] focus:ring-opacity-20 transition-all"
                placeholder="Ej: Consulta sobre proyecto de movilidad sostenible"
              />
              {errors.title && (
                <p className="text-[#c17767] text-xs mt-2 font-light flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Pregunta de la consulta */}
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                Pregunta de Sí o No
              </label>
              <textarea
                {...register('question', {
                  required: 'La pregunta es obligatoria',
                })}
                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355] focus:ring-opacity-20 transition-all resize-none"
                rows="3"
                placeholder="¿Está usted de acuerdo con...? (Formula la pregunta que será sometida a votación)"
              />
              {errors.question && (
                <p className="text-[#c17767] text-xs mt-2 font-light flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.question.message}
                </p>
              )}
            </div>

            {/* Descripción o justificación */}
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                Descripción / Justificación
              </label>
              <textarea
                {...register('description', {
                  required: 'La descripción es obligatoria',
                })}
                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355] focus:ring-opacity-20 transition-all resize-none"
                rows="4"
                placeholder="Explique los motivos, antecedentes y alcance de la consulta popular"
              />
              {errors.description && (
                <p className="text-[#c17767] text-xs mt-2 font-light flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sección: Ámbito y Organización */}
        <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0] mb-6">
          <div className="flex items-center mb-6 pb-4 border-b border-[#e5ddd0]">
            <div className="w-10 h-10 bg-[#f5f1eb] rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-[#8b7355]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#3d2f1f] tracking-wide">
              Ámbito y Organización
            </h3>
          </div>

          <div className="space-y-5">
            {/* Ámbito territorial */}
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                Ámbito Territorial
              </label>
              <select
                {...register('territorialScope', {
                  required: 'Debes seleccionar un ámbito',
                })}
                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] font-light focus:outline-none focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355] focus:ring-opacity-20 transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b7355' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25em 1.25em',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="">Seleccione el nivel territorial</option>
                <option value="nacional">Nacional</option>
                <option value="departamental">Departamental</option>
                <option value="municipal">Municipal</option>
              </select>
              {errors.territorialScope && (
                <p className="text-[#c17767] text-xs mt-2 font-light flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.territorialScope.message}
                </p>
              )}
            </div>

            {/* Entidad convocante */}
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                Entidad Convocante
              </label>
              <input
                type="text"
                {...register('organizer', {
                  required: 'La entidad convocante es obligatoria',
                })}
                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355] focus:ring-opacity-20 transition-all"
                placeholder="Ej: Alcaldía de Medellín, Gobernación de Antioquia"
              />
              {errors.organizer && (
                <p className="text-[#c17767] text-xs mt-2 font-light flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.organizer.message}
                </p>
              )}
            </div>

            {/* Fecha propuesta */}
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                Fecha Propuesta de Votación
              </label>
              <input
                type="date"
                {...register('date', { required: 'La fecha es obligatoria' })}
                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] font-light focus:outline-none focus:border-[#8b7355] focus:ring-2 focus:ring-[#8b7355] focus:ring-opacity-20 transition-all"
              />
              {errors.date && (
                <p className="text-[#c17767] text-xs mt-2 font-light flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sección: Documentos de Respaldo */}
        <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0] mb-6">
          <div className="flex items-center mb-6 pb-4 border-b border-[#e5ddd0]">
            <div className="w-10 h-10 bg-[#f5f1eb] rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-[#8b7355]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#3d2f1f] tracking-wide">
              Documentos de Respaldo
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
              Documentos de Respaldo (PDF)
            </label>
            <p className="text-xs text-[#8b7355] font-light mb-3">
              Adjunte estudios técnicos, jurídicos o de impacto que sustenten la
              consulta
            </p>
            <input
              type="file"
              accept=".pdf"
              {...register('supportDocs')}
              className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-light file:bg-[#8b7355] file:text-white hover:file:bg-[#6d5a43] file:cursor-pointer focus:outline-none focus:border-[#8b7355] transition-all"
            />
          </div>
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#3d2f1f] text-white font-light tracking-wide py-4 px-6 rounded-sm hover:bg-[#2a1f13] transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="flex items-center justify-center">
              Enviar Consulta
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
          </button>

          {/* Info adicional */}
          <div className="mt-6 p-4 bg-[#f5f1eb] rounded-sm border border-[#e5ddd0]">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-[#8b7355] mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-xs text-[#3d2f1f] font-medium mb-1">
                  Proceso de Revisión
                </p>
                <p className="text-xs text-[#8b7355] font-light leading-relaxed">
                  La propuesta será evaluada por el organismo electoral
                  competente. Se verificará el cumplimiento de requisitos
                  constitucionales y legales antes de su aprobación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
            <div className="w-24 h-0.5 bg-[#e5ddd0] mx-2"></div>
            <div className="w-3 h-3 bg-[#3d2f1f] rounded-full"></div>
            <div className="w-24 h-0.5 bg-[#e5ddd0] mx-2"></div>
            <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
          </div>
          <p className="text-xs text-[#b8a896] font-light">
            Mecanismo de participación democrática • Decisión ciudadana
            vinculante
          </p>
        </div>
      </form>
    </div>
  );
}
