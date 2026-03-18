"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bancada } from "../core/domain/types/bancada";
import {
  GetAllBancadasUseCase,
  DeleteBancadaUseCase,
} from "../core/application/usecases/bancada.usecases";
import { bancadaRepository } from "../infrastructure/adapters/django-bancada.repository";
import { logger } from "@/app/core/infrastructure/logger/logger";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";

const getAllBancadasUseCase = new GetAllBancadasUseCase(bancadaRepository);
const deleteBancadaUseCase = new DeleteBancadaUseCase(bancadaRepository);

export default function BancadasListPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [bancadas, setBancadas] = useState<Bancada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
    loadBancadas();
  }, []);

  const loadBancadas = async () => {
    try {
      setLoading(true);
      const data = await getAllBancadasUseCase.execute();
      setBancadas(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar bancadas";
      logger.error("PAGE: Error al cargar bancadas", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar esta bancada?")) return;

    try {
      setDeletingId(id);
      await deleteBancadaUseCase.execute(id);
      logger.success("PAGE: Bancada eliminada", { id });
      setBancadas((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar bancada";
      logger.error("PAGE: Error al eliminar bancada", { error: errorMessage });
      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBancadas = bancadas.filter((b) =>
    b.profesion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tipo_curul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.comision_permanente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-[#3d2f1f]">Bancadas del Consejo</h1>
            <p className="text-[#8b7355] mt-1">Gestión de bancadas municipales</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/bancadas")}
              className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
            >
              + Nueva Bancada
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 border border-[#d4c5b0]">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por profesión, tipo de curul o comisión..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e5ddd0] rounded-lg text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:ring-2 focus:ring-[#d4a574] transition-all"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
            </div>
          ) : filteredBancadas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#8b7355] mb-4">No hay bancadas registradas</p>
              <button
                onClick={() => router.push("/bancadas")}
                className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
              >
                Crear primera bancada
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5ddd0]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#8b7355]">Tipo Curul</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#8b7355]">Profesión</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#8b7355]">Comisión</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#8b7355]">Correo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#8b7355]">Fin Período</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#8b7355]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBancadas.map((bancada) => (
                    <tr key={bancada.id} className="border-b border-[#e5ddd0] hover:bg-[#faf8f5] transition-colors">
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bancada.tipo_curul === "Ordinaria"
                            ? "bg-green-100 text-green-800"
                            : bancada.tipo_curul === "Estatuto de Oposición"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {bancada.tipo_curul}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#3d2f1f]">{bancada.profesion}</td>
                      <td className="py-3 px-4 text-[#3d2f1f] text-sm">{bancada.comision_permanente}</td>
                      <td className="py-3 px-4 text-[#8b7355] text-sm">{bancada.correo_institucional}</td>
                      <td className="py-3 px-4 text-[#3d2f1f]">{bancada.fin_periodo}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => router.push(`/bancadas/${bancada.id}`)}
                            className="px-3 py-1 text-xs bg-[#f5f1eb] text-[#3d2f1f] rounded hover:bg-[#e5ddd0] transition-colors"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => handleDelete(bancada.id!)}
                            disabled={deletingId === bancada.id}
                            className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {deletingId === bancada.id ? "..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
