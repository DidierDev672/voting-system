"use client";

import { useForm } from "react-hook-form";

export default function RegisterPartyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de Partido Político</h1>

      {/* nombre del partido */}
      <div className="mb-4">
        <label className="block mb-1">Nombre del Partido / Movimiento</label>
        <input
          type="text"
          {...register("partyName", { required: "Este campo es obligatorio" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.partyName && (
          <p className="text-red-600">{errors.partyName.message}</p>
        )}
      </div>
      {/* Acta de fundación */}

      <div className="mb-4">
        <label className="block mb-1">Acta de Fundación (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          {...register("foundingAct", {
            required: "Debe subir el acta de fundación",
          })}
        />
        {errors.foundingAct && (
          <p className="text-red-600">{errors.foundingAct.message}</p>
        )}
      </div>

      {/* Estatutos del partido */}
      <div className="mb-4">
        <label className="block mb-1">Estatutos (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          {...register("statutes", { required: "Debe subir los estatutos" })}
        />
        {errors.statutes && (
          <p className="text-red-600">{errors.statutes.message}</p>
        )}
      </div>

      {/* Plataforma ideológica */}
      <div className="mb-4">
        <label className="block mb-1">Lista de Afiliados (documento)</label>
        <input
          type="file"
          accept=".pdf"
          {...register("affiliatesList", {
            required: "Debe subir la lista de afiliados",
          })}
        />
        {errors.affiliatesList && (
          <p className="text-red-600">{errors.affiliatesList.message}</p>
        )}
      </div>

      {/* Logo o símbolo */}
      <div className="mb-4">
        <label className="block mb-1">Logo o Símbolo (Imagen)</label>
        <input
          type="file"
          accept="image/*"
          {...register("logo", { required: "Debe subir un logo" })}
        />
        {errors.logo && <p className="text-red-600">{errors.logo.message}</p>}
      </div>

      {/* Contacto */}
      <div className="mb-4">
        <label className="block mb-1">Dirección del Partido</label>
        <input
          type="text"
          {...register("address", { required: "La dirección es obligatoria" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.address && (
          <p className="text-red-600">{errors.address.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-1">Correo de contacto</label>
        <input
          type="email"
          {...register("email", { required: "El correo es obligatorio" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enviar Solicitud
      </button>
    </form>
  );
}
