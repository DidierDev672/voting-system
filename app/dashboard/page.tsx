import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-light text-[#3d2f1f] mb-8">
          Panel Principal
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-sm border border-[#e5ddd0]">
            <h3 className="text-lg font-medium text-[#3d2f1f] mb-2">
              Total de Partidos
            </h3>
            <p className="text-3xl font-light text-[#8b7355]">0</p>
          </div>
          <div className="bg-white p-6 rounded-sm border border-[#e5ddd0]">
            <h3 className="text-lg font-medium text-[#3d2f1f] mb-2">
              Total de Miembros
            </h3>
            <p className="text-3xl font-light text-[#8b7355]">0</p>
          </div>
          <div className="bg-white p-6 rounded-sm border border-[#e5ddd0]">
            <h3 className="text-lg font-medium text-[#3d2f1f] mb-2">
              Votaciones Activas
            </h3>
            <p className="text-3xl font-light text-[#8b7355]">0</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
