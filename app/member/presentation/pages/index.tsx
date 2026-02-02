"use client";

import { useState } from "react";

export default function RegisterMember() {
  const [form, setForm] = useState({
    documentType: "",
    document: "",
    firtNames: "",
    lastNames: "",
    dateOfBirth: "",
    state: "",
    city: "",
    email: "",
    phone: "",
    acceptTerms: false,
    authorizesData: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.acceptTerms || !form.authorizesData) {
      alert("Debe aceptar los estatusos y la politica de datos.");
      return;
    }

    console.log("Datos enviados:", form);
  };

  return (
    <main style={{ maxWidth: 600, margin: "auto" }}>
      <h1>Registro de Miembro del partido</h1>

      <form onSubmit={handleSubmit}>
        <select name="documentType" onChange={handleChange} required>
          <option value="">Tipo de documento</option>
          <option value="CC">Cédula de ciudadanía</option>
          <option value="CE">Cédula de extranjería</option>
        </select>

        <input
          type="text"
          name="document"
          placeholder="Número de documento"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="firstNames"
          placeholder="Nombres"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastNames"
          placeholder="Apellidos"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dateOfBirth"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="state"
          placeholder="Departamento"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="Municipio"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          onChange={handleChange}
          required
        />

        <label>
          <input type="checkbox" name="acceptTerms" onChange={handleChange} />
          Declaro que no pertenezco a otro partido político y acepto los
          estatutos.
        </label>

        <label>
          <input
            type="checkbox"
            name="authorizesData"
            onChange={handleChange}
          />
          Autorizo el tratamiento de mis datos personales conforme a la Ley 1581
          de 2012.
        </label>

        <button type="submit">Registrar</button>
      </form>
    </main>
  );
}
