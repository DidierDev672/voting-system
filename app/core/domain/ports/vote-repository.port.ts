/**
 * Puerto de Repositorio de Votos
 * Principios SOLID:
 * - Interface Segregation: интерфейс específico para votos
 * - Dependency Inversion: depende de abstracciones, no de implementaciones
 */

import { Vote, CreateVoteDTO } from '../../domain/types';

export interface IVoteRepository {
  create(data: CreateVoteDTO): Promise<Vote>;
  findById(id: string): Promise<Vote | null>;
  findByConsultation(idConsult: string): Promise<Vote[]>;
  findByMember(idMember: string): Promise<Vote[]>;
  existsByMemberAndConsult(idMember: string, idConsult: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
