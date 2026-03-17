/**
 * Puerto del Repositorio - Sesion de Consejo Municipal
 * Vertical Slicing + SOLID Principles
 * Interface Segregation, Dependency Inversion
 */

import { MunicipalCouncilSession, CreateMunicipalCouncilSessionDTO } from '../types/municipal-council-session';

export interface IMunicipalCouncilSessionRepository {
  create(session: CreateMunicipalCouncilSessionDTO): Promise<MunicipalCouncilSession>;
  getAll(): Promise<MunicipalCouncilSession[]>;
  getById(id: string): Promise<MunicipalCouncilSession | null>;
  update(id: string, session: Partial<CreateMunicipalCouncilSessionDTO>): Promise<MunicipalCouncilSession>;
  delete(id: string): Promise<void>;
}
