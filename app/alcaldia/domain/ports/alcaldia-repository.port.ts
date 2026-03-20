/**
 * Repository Port - Alcaldia
 * Domain Layer
 * Dependency Inversion Principle - Interface for infrastructure
 */

import { Alcaldia, CreateAlcaldiaDTO, UpdateAlcaldiaDTO } from '../types/alcaldia';

export interface IAlcaldiaRepository {
  create(data: CreateAlcaldiaDTO): Promise<Alcaldia>;
  getAll(): Promise<Alcaldia[]>;
  getById(id: string): Promise<Alcaldia | null>;
  update(id: string, data: UpdateAlcaldiaDTO): Promise<Alcaldia>;
  delete(id: string): Promise<void>;
}
