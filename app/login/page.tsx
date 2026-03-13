"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SupabaseAuthAdapter } from "@/app/core/infrastructure/adapters/supabase-auth.adapter";
import { LoginUseCase } from "@/app/core/application/usecases/auth.usecases";

const authAdapter = new SupabaseAuthAdapter();
const loginUseCase = new LoginUseCase(authAdapter);

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificar si ya está autenticado
  useEffect(() => {
    setMounted(true);

    const session = localStorage.getItem("auth_session");
    if (session) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUseCase.execute({ email, password });

      localStorage.setItem("auth_session", JSON.stringify(result.session));
      localStorage.setItem("auth_user", JSON.stringify(result.user));

      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras se verifica mount
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f] mx-auto"></div>
          <p className="mt-4 text-[#8b7355]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f1eb] to-[#e8dfd3] px-4">
      <div className="w-full max-w-md">
        {/* Header con identidad de Cafeteria */}
        <div className="text-center mb-8">
          {/* Logo/Icono de café estilizado */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8b7355] to-[#6d5a43] rounded-full mb-6 shadow-lg">
            <svg
              className="w-8 h-8 text-[#f5f1eb]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-medium text-[#3d2f1f] mb-2">
            Sistema de Votación
          </h1>
          <p className="text-[#8b7355] font-light">
            Bienvenido, ingresa tus credenciales
          </p>
        </div>

        {/* Card principal con sombra calida */}
        <div className="bg-white rounded-lg shadow-xl p-8 border border-[#d4c5b0]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-gradient-to-r from-[#f5e6e0] to-[#fef5f3] border-l-4 border-[#d4a574] rounded-r-md">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#c17767] mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-[#c17767] font-light">{error}</p>
                </div>
              </div>
            )}

            {/* Campo de correo con acento de cafe */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center text-sm font-medium text-[#3d2f1f] mb-2"
              >
                <svg
                  className="w-4 h-4 text-[#8b7355] mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:bg-white transition-all duration-200"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            {/* Campo de contraseña con acento de café */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center text-sm font-medium text-[#3d2f1f] mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] placeholder-[#b8a896] font-light focus:outline-none focus:border-[#8b7355] focus:bg-white transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#3d2f1f] to-[#5a4332] text-white font-medium rounded-lg hover:from-[#2a1f13] hover:to-[#3d2f1f] focus:outline-none focus:ring-4 focus:ring-[#8b7355] focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Iniciar Sesión
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4c5b0] to-transparent"></div>
            <div className="flex space-x-2 mx-4">
              <div className="w-1.5 h-1.5 bg-[#8b7355] rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-[#b8a896] rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-[#8b7355] rounded-full"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4c5b0] to-transparent"></div>
          </div>

          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center text-sm text-[#8b7355] hover:text-[#3d2f1f] font-medium transition-colors group"
            >
              <svg
                className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-[#faf8f5] to-[#f5f1eb] rounded-lg border border-[#e5ddd0]">
          <div className="flex items-center text-xs text-[#8b7355]">
            <svg
              className="w-5 h-5 text-[#d4a574] mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="font-light">
              <span className="font-medium">Conexión segura.</span> Tu
              información está protegida con encriptación de extremo a extremo.
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
            <div className="w-20 h-px bg-gradient-to-r from-[#8b7355] to-[#d4c5b0] mx-2"></div>
            <div className="w-2.5 h-2.5 bg-[#3d2f1f] rounded-full"></div>
            <div className="w-20 h-px bg-gradient-to-r from-[#d4c5b0] to-[#8b7355] mx-2"></div>
            <div className="w-2 h-2 bg-[#8b7355] rounded-full"></div>
          </div>
          <p className="text-xs text-[#b8a896] font-light">
            Sistema Electoral Democrático • Voto Secreto y Seguro
          </p>
        </div>
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-[#8b7355]">
            ¿Olvidaste tu contraseña?{" "}
            <a href="#" className="text-[#3d2f1f] font-medium hover:underline">
              Recuperar
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
