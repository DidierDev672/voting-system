/**
 * Tipos de Partido Político
 * Vertical Slicing: Domain Layer
 */

export type PartyType = 'partido' | 'coalicion' | 'movimiento';

export interface PoliticalParty {
  id: string;
  name: string;
  acronym: string;
  partyType: PartyType;
  ideology: string;
  legalRepresentative: string;
  representativeId: string;
  email?: string;
  foundationDate?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartyDTO {
  name: string;
  acronym: string;
  partyType: PartyType;
  ideology: string;
  legalRepresentative: string;
  representativeId: string;
  email?: string;
  foundationDate?: string;
  isActive?: boolean;
}

export interface PartyResponse {
  success: boolean;
  party?: PoliticalParty;
  error?: string;
}
