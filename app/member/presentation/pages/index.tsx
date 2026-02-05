"use client";

import {useState} from "react";

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
        authorizesData: false
    });

    const handleChange = (e : React.ChangeEvent < HTMLInputElement | HTMLSelectElement >,) => {
        const {name, value, type} = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        });
    };

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        if (!form.acceptTerms || !form.authorizesData) {
            alert("Debe aceptar los estatusos y la politica de datos.");
            return;
        }

        console.log("Datos enviados:", form);
    };

    return (
        <main className="max-w-[600px] mx-auto py-12 px-4">
            <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-light text-[#3d2f1f] tracking-wide mb-3">Registro de Miembro del partido</h1>
                <div className="w-full h-0.5 bg-[#8b7355] mx-auto mb-4 mt-2">
                    <p className="text-[#8b7355] font-light text-sm">
                        Complete el formulario para unirse al partido político
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}
                className="space-y-6">
                <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0]">
                    <h2 className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0] tracking-wide">
                        Identificación Personal
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Tipo de Documento
                            </label>
                            <select name="documentType"
                                onChange={handleChange}
                                required
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all appearance-none cursor-pointer"
                                style={
                                    {
                                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b7355' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundSize: '1.25em 1.25em',
                                        paddingRight: '2.5rem'
                                    }
                            }>
                                <option value="">Seleccione tipo de documento</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="CE">Cédula de Extranjería</option>
                            </select>
                        </div>

                        {/* Número de documento */}
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Número de Documento
                            </label>
                            <input type="text" name="document" placeholder="Número de documento"
                                onChange={handleChange}
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
                                required/>
                        </div>
                    </div>
                </div>

                {/* Sección: Datos Personales  */}
                <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0]">
                    <h2 className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0] tracking-wide">Datos Personales</h2>
                    <div className="space-y-5">
                        {/* Nombres */}
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Nombres
                            </label>
                            <input type="text" name="firstNames" placeholder="Nombres"
                                onChange={handleChange}
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
                                required/>
                        </div>
                        {/* Apellidos */}
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Apellidos
                            </label>
                            <input type="text" name="lastNames" placeholder="Apellidos"
                                onChange={handleChange}
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
                                required/>
                        </div>

                        {/* Fecha de nacimiento */}
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Fecha de Nacimiento
                            </label>
                            <input type="date" name="dateOfBirth"
                                onChange={handleChange}
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
                                required/>
                        </div>
                    </div>
                </div>

                {/* Sección: Ubicación */}
                <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0]">
                    <h2 className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0] tracking-wide">
                        Ubicación
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Departamento
                            </label>
                            <input type="text" name="state" placeholder="Departamento"
                                onChange={handleChange}
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
                                required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Municipio
                            </label>
                            <input type="text" name="city" placeholder="Municipio"
                                onChange={handleChange}
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
                                required/>
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0]">
                    <h2 className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0] tracking-wide">
                        Información de Contacto
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Correo Electrónico
                            </label>
                            <input type="email" name="email" placeholder="Correo electrónico"
                                onChange={handleChange}
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
                                required/>
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-[#3d2f1f] mb-2 tracking-wide">
                                Teléfono
                            </label>
                            <input type="tel" name="phone" placeholder="Teléfono"
                                onChange={handleChange}
                                className="w-full bg-[#faf8f5] border border-[#e5ddd0] rounded-sm px-4 py-3 text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:ring-1 focus:ring-[#8b7355] transition-all"
                                required/>
                        </div>
                    </div>
                </div>

                {/* Declaraciones */}
                <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 border border-[#e5ddd0]">
                    <h2 className="text-lg font-medium text-[#3d2f1f] mb-6 pb-3 border-b border-[#e5ddd0] tracking-wide">
                        Declaraciones y Autorizaciones
                    </h2>

                    <div className="space-y-4">
                        <label className="flex items-start space-x-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center mt-0.5">
                                <input type="checkbox" name="acceptTerms"
                                    onChange={handleChange}
                                    className="w-5 h-5 bg-[#faf8f5] border-2 border-[#e5ddd0] rounded-sm appearance-none cursor-pointer checked:bg-[#3d2f1f] checked:border-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:ring-offset-2 transition-all"
                                    style={
                                        {
                                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='20 6 9 17 4 12'%3e%3c/polyline%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            backgroundSize: '0.875rem'
                                        }
                                    }/>
                            </div>
                            <span className="text-sm text-[#3d2f1f] font-light leading-relaxed group-hover:text-[#8b7355] transition-colors">
                                Declaro que no pertenezco a otro partido político y acepto los estatutos del partido.
                            </span>
                        </label>

                        {/* Datos personales  */}
                        <label className="flex items-start space-x-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center mt-0.5">
                                <input type="checkbox" name="authorizesData"
                                    onChange={handleChange}
                                    className="w-5 h-5 bg-[#faf8f5] border-2 border-[#e5ddd0] rounded-sm appearance-none cursor-pointer checked:bg-[#3d2f1f] checked:border-[#3d2f1f] focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:ring-offset-2 transition-all"
                                    style={
                                        {
                                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='20 6 9 17 4 12'%3e%3c/polyline%3e%3c/svg%3e")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            backgroundSize: '0.875rem'
                                        }
                                    }/>
                            </div>
                            <span className="text-sm text-[#3d2f1f] font-light leading-relaxed group-hover:text-[#8b7355] transition-colors">
                                Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012.
                            </span>
                        </label>
                    </div>
                </div>
                {/* Botón de envío */}
                <div className="pt-4">
                    <button type="submit" className="w-full bg-[#3d2f1f] text-white font-light tracking-wide py-4 px-6 rounded-sm hover:bg-[#2a1f13] transition-all duration-300 shadow-sm hover:shadow-md">
                        Registrar Miembro
                    </button>
                    <p className="text-xs text-[#8b7355] text-center mt-4 font-light">
                        La solicitud será revisada por el comité del partido
                    </p>
                </div>
            </form>

            {/* Footer decorativo */}
            <div className="mt-12 text-center">
                <div className="w-24 h-0.5 bg-[#e5ddd0] mx-auto mb-4"></div>
                <p className="text-xs text-[#b8a896] font-light">
                    Registro seguro • Datos protegidos • Proceso transparente
                </p>
            </div>
        </main>
    );
}
