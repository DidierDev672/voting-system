/**
 * Casos de Uso de Voto
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de voto
 * - Dependency Inversion: depende de IVoteRepository
 */

import { IVoteRepository } from '../../domain/ports/vote-repository.port';
import { Vote, CreateVoteDTO, VoteSummary, VoteDetail } from '../../domain/types/vote';
import { Consultation } from '../../domain/types/consultation';
import { IConsultationRepository } from '../../domain/ports/consultation-repository.port';
import { IPartyRepository } from '../../domain/ports/party-repository.port';
import { IPartyMemberRepository } from '../../domain/ports/party-member-repository.port';
import { PoliticalParty } from '../../domain/types/party';
import { PartyMember } from '../../domain/types/party-member';
import { logger } from '../../infrastructure/logger/logger';

export class CreateVoteUseCase {
  constructor(private readonly voteRepository: IVoteRepository) {}

  async execute(vote: CreateVoteDTO): Promise<Vote> {
    logger.info('USECASE: Iniciando CreateVoteUseCase', { consultationId: vote.consultationId });

    if (!vote.consultationId) {
      logger.warning('USECASE: ID de consulta no proporcionado');
      throw new Error('El ID de la consulta es requerido');
    }

    if (!vote.memberId || vote.memberId.trim().length === 0) {
      logger.warning('USECASE: ID de miembro no proporcionado');
      throw new Error('El ID del miembro es requerido');
    }

    if (!vote.partyId) {
      logger.warning('USECASE: Partido político no seleccionado');
      throw new Error('El partido político es requerido');
    }

    const hasVoted = await this.voteRepository.existsByMemberAndConsult(
      vote.memberId,
      vote.consultationId
    );

    if (hasVoted) {
      logger.warning('USECASE: El miembro ya ha votado en esta consulta');
      throw new Error('Ya has votado en esta consulta');
    }

    try {
      const result = await this.voteRepository.create(vote);
      logger.success('USECASE: CreateVoteUseCase completado', { id: result.id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en CreateVoteUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetVotesByConsultationUseCase {
  constructor(private readonly voteRepository: IVoteRepository) {}

  async execute(consultationId: string): Promise<Vote[]> {
    logger.info('USECASE: Iniciando GetVotesByConsultationUseCase', { consultationId });

    if (!consultationId) {
      logger.warning('USECASE: ID de consulta no proporcionado');
      throw new Error('El ID de la consulta es requerido');
    }

    try {
      const result = await this.voteRepository.getByConsultation(consultationId);
      logger.success('USECASE: GetVotesByConsultationUseCase completado', { count: result.length });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetVotesByConsultationUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetVotesByMemberUseCase {
  constructor(private readonly voteRepository: IVoteRepository) {}

  async execute(documentNumber: string): Promise<Vote[]> {
    logger.info('USECASE: Iniciando GetVotesByMemberUseCase', { documentNumber });

    if (!documentNumber) {
      logger.warning('USECASE: Número de documento no proporcionado');
      throw new Error('El número de documento es requerido');
    }

    try {
      const result = await this.voteRepository.getByMember(documentNumber);
      logger.success('USECASE: GetVotesByMemberUseCase completado', { count: result.length });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetVotesByMemberUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetAllVotesUseCase {
  constructor(
    private readonly voteRepository: IVoteRepository,
    private readonly consultationRepository: IConsultationRepository
  ) {}

  async execute(): Promise<VoteSummary[]> {
    logger.info('USECASE: Iniciando GetAllVotesUseCase');

    try {
      const votes = await this.voteRepository.getAll();
      const consultations = await this.consultationRepository.getAll();

      const consultationMap = new Map<string, Consultation>();
      consultations.forEach(c => consultationMap.set(c.id, c));

      const summaryMap = new Map<string, VoteSummary>();

      votes.forEach(vote => {
        const existing = summaryMap.get(vote.consultationId);
        const consultation = consultationMap.get(vote.consultationId);

        if (existing) {
          existing.totalVotes++;
          if (vote.valueVote) {
            existing.votesInFavor++;
          } else {
            existing.votesAgainst++;
          }
        } else {
          summaryMap.set(vote.consultationId, {
            consultationId: vote.consultationId,
            consultationTitle: consultation?.title || 'Sin título',
            totalVotes: 1,
            votesInFavor: vote.valueVote ? 1 : 0,
            votesAgainst: vote.valueVote ? 0 : 1,
          });
        }
      });

      const result = Array.from(summaryMap.values());
      logger.success('USECASE: GetAllVotesUseCase completado', { count: result.length });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetAllVotesUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetVoteDetailsUseCase {
  constructor(
    private readonly voteRepository: IVoteRepository,
    private readonly consultationRepository: IConsultationRepository,
    private readonly partyRepository: IPartyRepository,
    private readonly memberRepository: IPartyMemberRepository
  ) {}

  async execute(consultationId: string): Promise<{ summary: VoteSummary; details: VoteDetail[] }> {
    logger.info('USECASE: Iniciando GetVoteDetailsUseCase', { consultationId });

    try {
      const votes = await this.voteRepository.getByConsultation(consultationId);
      const consultation = await this.consultationRepository.getById(consultationId);
      const parties = await this.partyRepository.getAll();

      const partyMap = new Map<string, PoliticalParty>();
      parties.forEach(p => partyMap.set(p.id, p));

      const memberIds = [...new Set(votes.map(v => v.memberId))];
      const memberMap = new Map<string, PartyMember>();

      for (const memberId of memberIds) {
        try {
          const member = await this.memberRepository.getById(memberId);
          if (member) {
            memberMap.set(memberId, member);
          }
        } catch {
          // Member not found, continue
        }
      }

      const summary: VoteSummary = {
        consultationId,
        consultationTitle: consultation?.title || 'Sin título',
        totalVotes: votes.length,
        votesInFavor: votes.filter(v => v.valueVote).length,
        votesAgainst: votes.filter(v => !v.valueVote).length,
      };

      const details: VoteDetail[] = votes.map(vote => {
        const member = memberMap.get(vote.memberId);
        const party = member ? partyMap.get(member.politicalPartyId) : undefined;

        return {
          id: vote.id,
          memberName: member?.fullName || 'Desconocido',
          partyName: party?.name || 'Desconocido',
          partyAcronym: party?.acronym || '',
          valueVote: vote.valueVote,
          comment: vote.comment,
          createdAt: vote.createdAt,
        };
      });

      logger.success('USECASE: GetVoteDetailsUseCase completado', { 
        consultationId, 
        voteCount: details.length 
      });
      
      return { summary, details };
    } catch (error) {
      logger.error('USECASE: Error en GetVoteDetailsUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
