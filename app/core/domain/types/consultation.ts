/**
 * Tipos de Consulta Popular
 * Vertical Slicing: Domain Layer
 */

export type QuestionType = 'text' | 'multiple_choice' | 'single_choice' | 'scale';

export type ConsultationStatus = 'draft' | 'published' | 'closed';

export interface Question {
  id?: string;
  text: string;
  questionType: QuestionType;
  options?: string[];
  required: boolean;
}

export interface Consultation {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  proprietaryRepresentation: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationDTO {
  title: string;
  description: string;
  questions: Question[];
  proprietaryRepresentation: string;
  status: ConsultationStatus;
}

export interface ConsultationResponse {
  success: boolean;
  consultation?: Consultation;
  error?: string;
}
