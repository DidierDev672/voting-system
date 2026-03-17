/**
 * Puerto del Repositorio - Secretario de Consejo Municipal
 * Vertical Slicing + SOLID Principles
 * Interface Segregation, Dependency Inversion
 */

import { MunicipalCouncilSecretary, CreateMunicipalCouncilSecretaryDTO } from '../types/municipal-council-secretary';

export interface IMunicipalCouncilSecretaryRepository {
  create(secretary: CreateMunicipalCouncilSecretaryDTO): Promise<MunicipalCouncilSecretary>;
  getAll(): Promise<MunicipalCouncilSecretary[]>;
  getById(id: string): Promise<MunicipalCouncilSecretary | null>;
  update(id: string, secretary: Partial<CreateMunicipalCouncilSecretaryDTO>): Promise<MunicipalCouncilSecretary>;
  delete(id: string): Promise<void>;
}
