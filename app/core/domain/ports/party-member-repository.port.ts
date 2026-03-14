/**
 * Puerto de Repositorio de Miembro de Partido Político
 * Principios SOLID:
 * - Interface Segregation: interfaz específica para miembros
 * - Dependency Inversion: depende de abstracciones
 */

import { PartyMember, CreatePartyMemberDTO } from '../../domain/types/party-member';

export interface IPartyMemberRepository {
  create(member: CreatePartyMemberDTO): Promise<PartyMember>;
  getAll(): Promise<PartyMember[]>;
  getById(id: string): Promise<PartyMember | null>;
  getByPartyId(partyId: string): Promise<PartyMember[]>;
  delete(id: string): Promise<void>;
}
