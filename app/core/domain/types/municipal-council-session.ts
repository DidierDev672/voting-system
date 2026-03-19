/**
 * Domain Types - Sesion de Consejo Municipal
 * Vertical Slicing + SOLID Principles
 */

export type TypeSession = 'Ordinaria' | 'Extraordinaria' | 'Especial' | 'Instalacion';
export type StatusSession = 'Convocada' | 'En progreso' | 'Realizada' | 'Cancelada' | 'Postergada';
export type Modality = 'presencial' | 'virtual' | 'hibrida';

export interface SessionMember {
  id: string;
  idMember: string;
  memberName: string;
  memberDocument: string;
  memberEmail: string;
  isPresent: boolean;
  arrivalTime?: string;
}

export interface SessionBancada {
  id: string;
  idBancada: string;
  bancadaTipoCurul: string;
  bancadaProfesion: string;
  bancadaCorreo: string;
}

export interface MunicipalCouncilSession {
  id: string;
  titleSession: string;
  typeSession: TypeSession;
  statusSession: StatusSession;
  dateHourStart: string;
  dateHourEnd: string;
  modality: Modality;
  placeEnclosure: string;
  ordenDay: string;
  quorumRequired: number;
  idPresident: string;
  idSecretary: string;
  members: SessionMember[];
  bancadas: SessionBancada[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMunicipalCouncilSessionDTO {
  title_session: string;
  type_session: string;
  status_session: string;
  date_hour_start: string;
  date_hour_end: string;
  modality: string;
  place_enclosure: string;
  orden_day: string;
  quorum_required: number;
  id_president: string;
  id_secretary: string;
}
