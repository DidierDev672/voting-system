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
    <div className="min-h-screen bg-[#f5f1eb] py-12 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white rounded-sm p-8 md:p-12"
      >
        {/* Header */}
        <div className="mb-5 pb-4 border-b border-[#d4c5b0]">
          <h1 className="text-3xl font-light text-[#3d2f1f] tracking-wide mb-6">
            Registro de Partido Político
          </h1>
          <p className="text-sm text-[#8b7355] font-light">
            Complete el formulario con la información requerida
          </p>
        </div>

        {/* nombre del partido */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
            Nombre del Partido / Movimiento
          </label>
          <input
            type="text"
            {...register('partyName', {
              required: 'Este campo es obligatorio',
            })}
            className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
          />
          {errors.partyName && (
            <p className="text-[#c17767] text-xs mt-2 font-light">
              {errors.partyName.message}
            </p>
          )}
        </div>

        {/* Documentos legales Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0]">
            Documentos legales
          </h2>
        </div>

        {/* Acta de fundación */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
            Acta de Fundación (PDF)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-light file:bg-[#8b7355] file:text-white hover:file:bg-[#6d5a43] file:cursor-pointer focus:outline-none focus:border-[#8b7355] transition-all"
              {...register('foundingAct', {
                required: 'Debe subir el acta de fundación',
              })}
            />
            {errors.foundingAct && (
              <p className="text-[#c17767] text-xs mt-2 font-light">
                {errors.foundingAct.message}
              </p>
            )}
          </div>
        </div>

        {/* Estatutos del partido */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
            Estatutos (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-light file:bg-[#8b7355] file:text-white hover:file:bg-[#6d5a43] file:cursor-pointer focus:outline-none focus:border-[#8b7355] transition-all"
            {...register('statutes', { required: 'Debe subir los estatutos' })}
          />
          {errors.statutes && (
            <p className="text-[#c17767] text-xs mt-2 font-light">
              {errors.statutes.message}
            </p>
          )}
        </div>

        {/* Plataforma ideológica */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
            Lista de Afiliados (documento)
          </label>
          <input
            type="file"
            accept=".pdf"
            className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-light file:bg-[#8b7355] file:text-white hover:file:bg-[#6d5a43] file:cursor-pointer focus:outline-none focus:border-[#8b7355] transition-all"
            {...register('affiliatesList', {
              required: 'Debe subir la lista de afiliados',
            })}
          />
          {errors.affiliatesList && (
            <p className="text-[#c17767] text-xs mt-2 font-light">
              {errors.affiliatesList.message}
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0]">
            Identidad visual
          </h2>

          {/* Logo o símbolo */}
          <div className="mb-8">
            <label className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0]">
              Logo o Símbolo (Imagen)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-light file:bg-[#8b7355] file:text-white hover:file:bg-[#6d5a43] file:cursor-pointer focus:outline-none focus:border-[#8b7355] transition-all"
              {...register('logo', { required: 'Debe subir un logo' })}
            />
            {errors.logo && (
              <p className="text-[#c17767] text-xs mt-2 font-light">
                {errors.logo.message}
              </p>
            )}
          </div>
        </div>

        {/* Contacto */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0]">
            Información de Contacto
          </h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
              Dirección del Partido
            </label>
            <input
              type="text"
              {...register('address', {
                required: 'La dirección es obligatoria',
              })}
              className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
            />
            {errors.address && (
              <p className="text-[#c17767] text-xs mt-2 font-light">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
            Correo de contacto
          </label>
          <input
            type="email"
            {...register('email', { required: 'El correo es obligatorio' })}
            className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-al"
          />
          {errors.email && (
            <p className="text-[#c17767] text-xs mt-2 font-light">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="pt-6 border-t border-[#e5ddd0]">
          <button
            type="submit"
            className="w-full bg-[#3d2f1f] text-white font-light tracking-wide py-4 px-6 rounded-sm hover:bg-[#2a1f13] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Enviar Solicitud de Registro
          </button>
        </div>
      </form>

      {/* Footer Note */}
      <div className="max-2-2xl mx-auto mt-8 text-center">
        <p className="text-xs text-[#8b7355] font-ligth">
          Diseñado con atención al detalle • Sistema de votación democrático
        </p>
      </div>
    </div>
  );
}
