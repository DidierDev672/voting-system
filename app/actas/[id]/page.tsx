'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';
import { MunicipalCouncilSession } from '@/app/core/domain/types/municipal-council-session';
import { DjangoMunicipalCouncilSessionRepository } from '@/app/core/infrastructure/adapters/django-municipal-council-session.repository';

const sessionRepository = new DjangoMunicipalCouncilSessionRepository();

export default function ActaDetallePage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<MunicipalCouncilSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const allSessions = await sessionRepository.getAll();
      const foundSession = allSessions.find(s => s.id === sessionId);

      if (foundSession) {
        setSession(foundSession);
      } else {
        setError('Sesión no encontrada');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Convocada': return 'CONVOCADA';
      case 'En progreso': return 'EN PROGRESO';
      case 'Realizada': return 'REALIZADA';
      case 'Cancelada': return 'CANCELADA';
      case 'Postergada': return 'POSTERGADA';
      default: return status.toUpperCase();
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f] mx-auto"></div>
            <p className="mt-4 text-[#8b7355]">Cargando acta...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !session) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12 border border-[#d4c5b0] text-center">
            <p className="text-red-600 mb-4">{error || 'Sesión no encontrada'}</p>
            <button
              onClick={() => router.push('/actas/list')}
              className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
            >
              Volver a las actas
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-center no-print">
          <button
            onClick={() => router.push('/actas/list')}
            className="flex items-center gap-2 text-[#8b7355] hover:text-[#3d2f1f] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a las actas
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Acta
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-xl border-2 border-[#3d2f1f] overflow-hidden">
          <div className="p-8 border-b-2 border-[#3d2f1f] bg-[#faf8f5]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#3d2f1f] uppercase tracking-wider">
                Acta de Sesión del Consejo Municipal
              </h1>
              <p className="text-lg font-medium text-[#3d2f1f] mt-2">
                {session.titleSession}
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  session.statusSession === 'Realizada' ? 'bg-green-100 text-green-800' :
                  session.statusSession === 'En progreso' ? 'bg-yellow-100 text-yellow-800' :
                  session.statusSession === 'Convocada' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  SESIÓN {getStatusText(session.statusSession)}
                </span>
                <span className="px-4 py-1 rounded-full text-sm font-medium bg-[#3d2f1f] text-white">
                  {session.typeSession.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-[#3d2f1f] border-b-2 border-[#3d2f1f] pb-2 mb-4">
                I. INFORMACIÓN DE LA SESIÓN
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-[#3d2f1f]">Fecha y Hora de Inicio:</p>
                  <p className="text-[#8b7355]">
                    {new Date(session.dateHourStart).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })} a las {new Date(session.dateHourStart).toLocaleTimeString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#3d2f1f]">Fecha y Hora de Finalización:</p>
                  <p className="text-[#8b7355]">
                    {new Date(session.dateHourEnd).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })} a las {new Date(session.dateHourEnd).toLocaleTimeString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#3d2f1f]">Lugar:</p>
                  <p className="text-[#8b7355]">{session.placeEnclosure}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#3d2f1f]">Modalidad:</p>
                  <p className="text-[#8b7355] capitalize">{session.modality}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#3d2f1f]">Quórum Requerido:</p>
                  <p className="text-[#8b7355]">{session.quorumRequired} miembros</p>
                </div>
                <div>
                  <p className="font-semibold text-[#3d2f1f]">Miembros Presentes:</p>
                  <p className="text-[#8b7355]">{session.members.filter(m => m.isPresent).length} de {session.members.length}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#3d2f1f] border-b-2 border-[#3d2f1f] pb-2 mb-4">
                II. ORDEN DEL DÍA
              </h2>
              <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e5ddd0]">
                <pre className="whitespace-pre-wrap text-[#3d2f1f] text-sm leading-relaxed font-light">
                  {session.ordenDay}
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#3d2f1f] border-b-2 border-[#3d2f1f] pb-2 mb-4">
                III. MIEMBROS DEL CONSEJO
              </h2>
              {session.members.length === 0 ? (
                <p className="text-[#8b7355] italic">No hay miembros registrados</p>
              ) : (
                <div className="space-y-3">
                  {session.members.map((member, index) => (
                    <div key={member.id} className="flex items-center gap-4 p-3 bg-[#faf8f5] rounded-lg border border-[#e5ddd0]">
                      <span className="w-8 h-8 bg-[#3d2f1f] text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-[#3d2f1f]">{member.memberName || member.idMember}</p>
                        <p className="text-xs text-[#8b7355]">CC: {member.memberDocument || 'No disponible'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.isPresent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.isPresent ? 'PRESENTE' : 'AUSENTE'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#3d2f1f] border-b-2 border-[#3d2f1f] pb-2 mb-4">
                IV. BANCADAS PARTICIPANTES
              </h2>
              {session.bancadas.length === 0 ? (
                <p className="text-[#8b7355] italic">No hay bancadas registradas</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {session.bancadas.map((bancada) => (
                    <div key={bancada.id} className="p-4 bg-[#faf8f5] rounded-lg border border-[#e5ddd0]">
                      <p className="font-medium text-[#3d2f1f]">{bancada.bancadaProfesion || bancada.idBancada}</p>
                      <p className="text-xs text-[#8b7355] mt-1">{bancada.bancadaTipoCurul || 'Bancada'}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="border-t-2 border-[#3d2f1f] pt-8">
              <h2 className="text-xl font-bold text-[#3d2f1f] mb-6">
                V. FIRMAS DE APROBACIÓN
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="border-t-2 border-[#3d2f1f] pt-4">
                  <p className="font-medium text-[#3d2f1f]">_________________________</p>
                  <p className="text-sm text-[#8b7355] mt-2">Presidente del Consejo</p>
                </div>
                <div className="border-t-2 border-[#3d2f1f] pt-4">
                  <p className="font-medium text-[#3d2f1f]">_________________________</p>
                  <p className="text-sm text-[#8b7355] mt-2">Secretario del Consejo</p>
                </div>
              </div>
            </section>

            <div className="text-center text-xs text-[#8b7355] border-t border-[#e5ddd0] pt-4">
              <p>Acta generada el {new Date().toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
              <p className="mt-1">Sistema de Votación Municipal - Consejo Municipal</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
