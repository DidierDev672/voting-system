/**
 * Puerto de Repositorio de Consulta Popular
 * Principios SOLID:
 * - Interface Segregation: интерфейс específico para consultas
 * - Dependency Inversion: depende de abstracciones, no de implementaciones
 */

import { PopularConsultation, CreateConsultationDTO, UpdateConsultationDTO } from '../../domain/types';

export interface IConsultationRepository {
  create(data: CreateConsultationDTO): Promise<PopularConsultation>;
  findById(id: string): Promise<PopularConsultation | null>;
  findAll(): Promise<PopularConsultation[]>;
  findByStatus(status: string): Promise<PopularConsultation[]>;
  update(id: string, data: UpdateConsultationDTO): Promise<PopularConsultation>;
  delete(id: string): Promise<boolean>;
}
