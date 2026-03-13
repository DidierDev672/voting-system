/**
 * Tipos de Entidades del Dominio
 * Principios SOLID: Single Responsibility - tipos puros de dominio
 */

// ============================================
// TIPOS BASE
// ============================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// USUARIO
// ============================================

export interface User extends BaseEntity {
  authId: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
}

export type UserRole = 'ADMIN' | 'AGENT' | 'CITIZEN';

export interface CreateUserDTO {
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  fullName?: string;
  documentType?: string;
  documentNumber?: string;
  phone?: string;
}

// ============================================
// CONSULTA POPULAR
// ============================================

export type ConsultationStatus = 'draft' | 'published' | 'closed';

export interface Question {
  id: string;
  text: string;
  questionType: QuestionType;
  options?: string[];
  required: boolean;
}

export type QuestionType = 'text' | 'multiple_choice' | 'single_choice' | 'scale';

export interface PopularConsultation extends BaseEntity {
  title: string;
  description: string;
  questions: Question[];
  proprietaryRepresentation: string;
  status: ConsultationStatus;
}

export interface CreateConsultationDTO {
  title: string;
  description: string;
  questions: Question[];
  proprietaryRepresentation: string;
}

export interface UpdateConsultationDTO {
  title?: string;
  description?: questions?: Question[];
  proprietaryRepresentation?: string;
  status?: ConsultationStatus;
}

// ============================================
// VOTO
// ============================================

export interface Vote extends BaseEntity {
  idConsult: string;
  idMember: string;
  idParty: string;
  idAuth: string;
  valueVote: boolean;
  comment?: string;
}

export interface CreateVoteDTO {
  idConsult: string;
  idMember: string;
  idParty: string;
  idAuth: string;
  valueVote: boolean;
  comment?: string;
}

// ============================================
// PARTIDO POLÍTICO
// ============================================

export interface PoliticalParty extends BaseEntity {
  name: string;
  acronym: string;
  logo?: string;
  description: string;
  isActive: boolean;
}

// ============================================
// MIEMBRO DE PARTIDO
// ============================================

export interface PartyMember extends BaseEntity {
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone?: string;
  politicalPartyId: string;
  position: string;
  isActive: boolean;
}
