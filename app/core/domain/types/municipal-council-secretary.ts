/**
 * Domain Types - Secretario de Consejo Municipal
 * Vertical Slicing + SOLID Principles
 */

export type DocumentType = 'CI' | 'Pasaporte' | 'Licencia' | 'Otro';
export type ExactPosition = 'Secretario General' | 'Secretario de comision';
export type PerformanceType = 'ad-hoc' | 'temporal';

export interface MunicipalCouncilSecretary {
  id: string;
  fullName: string;
  documentType: DocumentType;
  documentId: string;
  exactPosition: ExactPosition;
  administrativeAct: string;
  possessionDate: string;
  legalPeriod: string;
  professionalTitle?: string;
  performanceType: PerformanceType;
  institutionalEmail: string;
  digitalSignature?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMunicipalCouncilSecretaryDTO {
  full_name: string;
  document_type: string;
  document_id: string;
  exact_position: string;
  administrative_act: string;
  possession_date: string;
  legal_period: string;
  professional_title?: string;
  performance_type: string;
  institutional_email: string;
  digital_signature?: string;
}
