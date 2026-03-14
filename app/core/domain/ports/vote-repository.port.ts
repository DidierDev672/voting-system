/**
 * Puerto de Repositorio de Voto
 * Principios SOLID:
 * - Interface Segregation: interfaz específica para votos
 * - Dependency Inversion: depende de abstracciones
 */

import { Vote, CreateVoteDTO } from '../../domain/types/vote';

export interface IVoteRepository {
  create(vote: CreateVoteDTO): Promise<Vote>;
  getAll(): Promise<Vote[]>;
  getByConsultation(consultationId: string): Promise<Vote[]>;
  getByMember(documentNumber: string): Promise<Vote[]>;
  existsByMemberAndConsult(memberId: string, consultationId: string): Promise<boolean>;
}
