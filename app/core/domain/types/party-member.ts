/**
 * Tipos de Miembro de Partido Político
 * Vertical Slicing: Domain Layer
 */

export type DocumentType = 'CC' | 'TI' | 'CE';

export interface PartyMember {
  id: string;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate: string;
  city: string;
  politicalPartyId: string;
  politicalPartyName?: string;
  consent: boolean;
  dataAuthorization: boolean;
  affiliationDate: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartyMemberDTO {
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate: string;
  city: string;
  politicalPartyId: string;
  consent: boolean;
  dataAuthorization: boolean;
  affiliationDate: string;
}

export interface PartyMemberResponse {
  success: boolean;
  member?: PartyMember;
  error?: string;
}
