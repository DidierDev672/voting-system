'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';
import { DjangoPartyMemberRepository } from '@/app/core/infrastructure/adapters/django-party-member.repository';
import { DjangoPartyRepository } from '@/app/core/infrastructure/adapters/django-party.repository';
import { GetAllMembersUseCase, DeletePartyMemberUseCase } from '@/app/core/application/usecases/party-member.usecases';
import { PartyMember } from '@/app/core/domain/types/party-member';
import { PoliticalParty } from '@/app/core/domain/types/party';
import { logger } from '@/app/core/infrastructure/logger/logger';

const memberRepository = new DjangoPartyMemberRepository();
const partyRepository = new DjangoPartyRepository();
const getAllMembersUseCase = new GetAllMembersUseCase(memberRepository);
const deleteMemberUseCase = new DeletePartyMemberUseCase(memberRepository);

function MemberListContent() {
  const [mounted, setMounted] = useState(false);
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [parties, setParties] = useState<PoliticalParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, partiesData] = await Promise.all([
        getAllMembersUseCase.execute(),
        partyRepository.getAll(),
      ]);
      setMembers(membersData);
      setParties(partiesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
      logger.error('PAGE: Error al cargar datos', { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPartyName = (partyId: string): string => {
    const party = parties.find((p) => p.id === partyId);
    return party ? `${party.name} (${party.acronym})` : 'N/A';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteMemberUseCase.execute(id);
      logger.success('PAGE: Miembro eliminado', { id });
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar miembro';
      logger.error('PAGE: Error al eliminar miembro', { error: errorMessage });
      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (
      member.fullName.toLowerCase().includes(term) ||
      member.documentNumber.toLowerCase().includes(term) ||
      member.city.toLowerCase().includes(term) ||
      getPartyName(member.politicalPartyId).toLowerCase().includes(term)
    );
  });

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#d4c5b0]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-medium text-[#3d2f1f]">
              Lista de Miembros
            </h2>
            <p className="text-[#8b7355] mt-1">
              {searchTerm
                ? `${filteredMembers.length} de ${members.length} miembro(s)`
                : `${members.length} miembro(s) registrado(s)`}
            </p>
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#2a1f13] transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#f5e6e0] to-[#fef5f3] border-l-4 border-[#d4a574] rounded-r-md">
            <p className="text-sm text-[#c17767]">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#b8a896]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, documento, ciudad o partido..."
              className="w-full pl-12 pr-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] placeholder-[#b8a896] focus:outline-none focus:border-[#8b7355] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#b8a896] hover:text-[#3d2f1f]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3d2f1f]"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <>
                <svg className="w-16 h-16 mx-auto text-[#d4c5b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="mt-4 text-[#8b7355]">No se encontraron miembros con "{searchTerm}"</p>
              </>
            ) : (
              <>
                <svg className="w-16 h-16 mx-auto text-[#d4c5b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-4 text-[#8b7355]">No hay miembros registrados</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f1eb] border-b-2 border-[#d4c5b0]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">Nombre Completo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">Número de Documento</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">Ciudad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#3d2f1f]">Partido Político</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#3d2f1f]">Estado</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-[#3d2f1f]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`border-b border-[#e5ddd0] hover:bg-[#faf8f5] transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'
                    }`}
                  >
                    <td className="px-4 py-4 text-[#3d2f1f]">{member.fullName}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8b7355] text-white">
                        {member.documentType} {member.documentNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#3d2f1f]">{member.city}</td>
                    <td className="px-4 py-4 text-[#3d2f1f]">{getPartyName(member.politicalPartyId)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.isActive !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={deletingId === member.id}
                          className="p-2 text-[#c17767] hover:text-red-700 hover:bg-[#f5e6e0] rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deletingId === member.id ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
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
  );
}

export default function MemberListPage() {
  return (
    <DashboardLayout>
      <MemberListContent />
    </DashboardLayout>
  );
}
