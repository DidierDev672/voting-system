/**
 * Puerto de Repositorio de Consulta Popular
 * Principios SOLID:
 * - Interface Segregation: interfaz específica para consultas
 * - Dependency Inversion: depende de abstracciones
 */

import { Consultation, CreateConsultationDTO } from '../../domain/types/consultation';

export interface IConsultationRepository {
  create(consultation: CreateConsultationDTO): Promise<Consultation>;
  getAll(): Promise<Consultation[]>;
  getById(id: string): Promise<Consultation | null>;
  update(id: string, consultation: Partial<CreateConsultationDTO>): Promise<Consultation>;
  publish(id: string): Promise<Consultation>;
  close(id: string): Promise<Consultation>;
  delete(id: string): Promise<void>;
}
