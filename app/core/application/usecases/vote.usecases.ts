/**
 * Caso de Uso: Registrar Voto
 * Principios SOLID:
 * - Single Responsibility: una sola razón para cambiar (lógica de registrar voto)
 * - Dependency Inversion: depende de la abstracción IVoteRepository
 */

import { IVoteRepository } from '../../domain/ports/vote-repository.port';
import { Vote, CreateVoteDTO } from '../../domain/types';

export class RegisterVoteUseCase {
  constructor(private readonly repository: IVoteRepository) {}

  async execute(data: CreateVoteDTO): Promise<Vote> {
    // Validaciones de negocio
    if (!data.idConsult) {
      throw new Error('El ID de la consulta es requerido');
    }

    if (!data.idMember) {
      throw new Error('El ID del miembro es requerido');
    }

    if (!data.idParty) {
      throw new Error('El ID del partido es requerido');
    }

    if (!data.idAuth) {
      throw new Error('El ID de la autoridad es requerido');
    }

    // Verificar que el miembro no haya votado previamente
    const hasVoted = await this.repository.existsByMemberAndConsult(
      data.idMember,
      data.idConsult
    );

    if (hasVoted) {
      throw new Error('El miembro ya ha emitido su voto en esta consulta');
    }

    return this.repository.create(data);
  }
}

/**
 * Caso de Uso: Obtener Votos por Consulta
 */

export class GetVotesByConsultationUseCase {
  constructor(private readonly repository: IVoteRepository) {}

  async execute(idConsult: string): Promise<Vote[]> {
    if (!idConsult) {
      throw new Error('El ID de la consulta es requerido');
    }

    return this.repository.findByConsultation(idConsult);
  }
}

/**
 * Caso de Uso: Obtener Votos por Miembro
 */

export class GetVotesByMemberUseCase {
  constructor(private readonly repository: IVoteRepository) {}

  async execute(idMember: string): Promise<Vote[]> {
    if (!idMember) {
      throw new Error('El ID del miembro es requerido');
    }

    return this.repository.findByMember(idMember);
  }
}
