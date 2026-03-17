/**
 * Domain Types - Presidente de Consejo Municipal
 * Vertical Slicing + SOLID Principles
 */

export type DocumentType = 'CI' | 'Pasaporte' | 'Licencia' | 'Otro';
export type PresidencyType = 'Propietario' | 'Suplente' | 'Interino';

export interface MunicipalCouncilPresident {
  id: string;
  fullName: string;
  documentType: DocumentType;
  documentId: string;
  boardPosition: string;
  politicalParty: string;
  electionPeriod: string;
  presidencyType: PresidencyType;
  positionTime: string;
  institutionalEmail: string;
  digitalSignature?: string;
  fingerprint?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMunicipalCouncilPresidentDTO {
  full_name: string;
  document_type: string;
  document_id: string;
  board_position: string;
  political_party: string;
  election_period: string;
  presidency_type: string;
  position_time: string;
  institutional_email: string;
  digital_signature?: string;
  fingerprint?: string;
}
