/**
 * Puerto de Repositorio de Partido Político
 * Principios SOLID:
 * - Interface Segregation: interfaz específica para partidos
 * - Dependency Inversion: depende de abstracciones
 */

import { PoliticalParty, CreatePartyDTO } from '../../domain/types/party';

export interface IPartyRepository {
  create(party: CreatePartyDTO): Promise<PoliticalParty>;
  getAll(): Promise<PoliticalParty[]>;
  getById(id: string): Promise<PoliticalParty | null>;
  update(id: string, party: Partial<CreatePartyDTO>): Promise<PoliticalParty>;
  delete(id: string): Promise<void>;
}
