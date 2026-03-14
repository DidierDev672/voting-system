'use client';

import { useForm } from 'react-hook-form';

export default function RegisterPartyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Datos del formulario:', data);
  };

  return (
    <div className="max-w-6xl  min-h-screen bg-[#faf8f5] py-16 px-4">
      {/* Header minimalista */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <div className="inline-block mb-8">
          <div className="w-12 h-12 bg-[#3d2f1f] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-[#f5f1eb]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-[#3d2f1f] tracking-wide mb-3">
            Registro de Partido
          </h1>
          <div className="w-20 h-px bg-[#d4c5b0] mx-auto mb-4"></div>
          <p className="text-sm text-[#8b7355] font-light max-w-md mx-auto">
            Complete la información requerida para solicitar el registro oficial
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* SECCIÓN 1: Información Básica */}
        <section className="bg-white rounded-lg p-8 border border-[#e5ddd0]">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-[#3d2f1f] mb-1">
              Información Básica
            </h2>
            <p className="text-xs text-[#8b7355] font-light">
              Identidad del partido político
            </p>
          </div>

          <div>
            <label className="block text-sm text-[#3d2f1f] mb-2 font-light">
              Nombre del Partido <span className="text-[#c17767]">*</span>
            </label>
            <input
              type="text"
              {...register('partyName', {
                required: 'Este campo es obligatorio',
              })}
              className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-md px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] transition-colors"
              placeholder="Nombre oficial del partido"
            />
            {errors.partyName && (
              <p className="text-[#c17767] text-xs mt-2 font-light">
                {errors.partyName.message}
              </p>
            )}
          </div>
        </section>

        {/* SECCIÓN 2: Documentos Legales */}
        <section className="bg-white rounded-lg p-8 border border-[#e5ddd0]">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-[#3d2f1f] mb-1">
              Documentos Legales
            </h2>
            <p className="text-xs text-[#8b7355] font-light">
              Archivos en formato PDF
            </p>
          </div>

          <div className="space-y-5">
            {/* Acta de fundación */}
            <FileUploadField
              label="Acta de Fundación"
              description="Documento de creación oficial del partido"
              register={register('foundingAct', {
                required: 'Debe subir el acta de fundación',
              })}
              error={errors.foundingAct}
              accept=".pdf"
            />

            {/* Estatutos */}
            <FileUploadField
              label="Estatutos del Partido"
              description="Reglamento interno y objetivos"
              register={register('statutes', {
                required: 'Debe subir los estatutos',
              })}
              error={errors.statutes}
              accept=".pdf"
            />

            {/* Lista de afiliados */}
            <FileUploadField
              label="Lista de Afiliados"
              description="Listado oficial de miembros"
              register={register('affiliatesList', {
                required: 'Debe subir la lista de afiliados',
              })}
              error={errors.affiliatesList}
              accept=".pdf"
            />
          </div>
        </section>

        {/* SECCIÓN 3: Identidad Visual */}
        <section className="bg-white rounded-lg p-8 border border-[#e5ddd0]">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-[#3d2f1f] mb-1">
              Identidad Visual
            </h2>
            <p className="text-xs text-[#8b7355] font-light">
              Logo oficial del partido
            </p>
          </div>

          <FileUploadField
            label="Logo del Partido"
            description="Imagen en formato PNG, JPG o SVG"
            register={register('logo', { required: 'Debe subir un logo' })}
            error={errors.logo}
            accept="image/*"
          />
        </section>

        {/* SECCIÓN 4: Información de Contacto */}
        <section className="bg-white rounded-lg p-8 border border-[#e5ddd0]">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-[#3d2f1f] mb-1">
              Información de Contacto
            </h2>
            <p className="text-xs text-[#8b7355] font-light">
              Datos para comunicación oficial
            </p>
          </div>

          <div className="space-y-5">
            {/* Dirección */}
            <div>
              <label className="block text-sm text-[#3d2f1f] mb-2 font-light">
                Dirección de la Sede <span className="text-[#c17767]">*</span>
              </label>
              <input
                type="text"
                {...register('address', {
                  required: 'La dirección es obligatoria',
                })}
                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-md px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] transition-colors"
                placeholder="Calle, número, ciudad"
              />
              {errors.address && (
                <p className="text-[#c17767] text-xs mt-2 font-light">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-[#3d2f1f] mb-2 font-light">
                Correo Electrónico <span className="text-[#c17767]">*</span>
              </label>
              <input
                type="email"
                {...register('email', { required: 'El correo es obligatorio' })}
                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-md px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] transition-colors"
                placeholder="contacto@partido.com"
              />
              {errors.email && (
                <p className="text-[#c17767] text-xs mt-2 font-light">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#3d2f1f] text-white font-light py-4 rounded-md hover:bg-[#2a1f13] transition-colors duration-200"
          >
            Enviar Solicitud de Registro
          </button>

          {/* Info final */}
          <div className="mt-6 p-4 bg-[#faf8f5] rounded-md border border-[#e5ddd0]">
            <p className="text-xs text-[#8b7355] font-light text-center">
              Su solicitud será revisada en un plazo de 30 días hábiles.
              Recibirá una notificación por correo electrónico.
            </p>
          </div>
        </div>
      </form>

      {/* Footer minimalista */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="w-12 h-px bg-[#d4c5b0] mx-auto mb-3"></div>
        <p className="text-xs text-[#b8a896] font-light">
          Sistema Electoral Democrático
        </p>
      </div>
    </div>
  );
}
