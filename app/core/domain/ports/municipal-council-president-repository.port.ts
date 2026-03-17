/**
 * Puerto del Repositorio - Presidente de Consejo Municipal
 * Vertical Slicing + SOLID Principles
 * Interface Segregation, Dependency Inversion
 */

import { MunicipalCouncilPresident, CreateMunicipalCouncilPresidentDTO } from '../types/municipal-council-president';

export interface IMunicipalCouncilPresidentRepository {
  create(president: CreateMunicipalCouncilPresidentDTO): Promise<MunicipalCouncilPresident>;
  getAll(): Promise<MunicipalCouncilPresident[]>;
  getById(id: string): Promise<MunicipalCouncilPresident | null>;
  update(id: string, president: Partial<CreateMunicipalCouncilPresidentDTO>): Promise<MunicipalCouncilPresident>;
  delete(id: string): Promise<void>;
}
