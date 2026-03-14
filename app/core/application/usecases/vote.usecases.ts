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
      const allMembers = await this.memberRepository.getAll();

      console.log('=== VOTE DETAILS DEBUG ===');
      console.log('Votes:', JSON.stringify(votes, null, 2));
      console.log('Parties:', JSON.stringify(parties, null, 2));
      console.log('All Members:', JSON.stringify(allMembers.slice(0, 3), null, 2));

      const partyMap = new Map<string, PoliticalParty>();
      parties.forEach(p => partyMap.set(p.id, p));

      const memberMap = new Map<string, PartyMember>();
      allMembers.forEach(m => memberMap.set(m.id, m));

      console.log('Party map keys:', Array.from(partyMap.keys()));
      console.log('Member map keys:', Array.from(memberMap.keys()).slice(0, 5));

      const summary: VoteSummary = {
        consultationId,
        consultationTitle: consultation?.title || 'Sin título',
        totalVotes: votes.length,
        votesInFavor: votes.filter(v => v.valueVote).length,
        votesAgainst: votes.filter(v => !v.valueVote).length,
      };

      const votesInFavor = summary.votesInFavor;
      const votesAgainst = summary.votesAgainst;
      let result: 'winner' | 'loser' | 'tie';
      
      if (votesInFavor > votesAgainst) {
        result = 'winner';
      } else if (votesAgainst > votesInFavor) {
        result = 'loser';
      } else {
        result = 'tie';
      }

      const details: VoteDetail[] = votes.map(vote => {
        const member = memberMap.get(vote.memberId);
        const party = member ? partyMap.get(member.politicalPartyId) : undefined;

        console.log('Processing vote:', vote.id, 'memberId:', vote.memberId, 'found:', !!member, 'partyId:', member?.politicalPartyId);

        const memberIdStr = vote.memberId || '';
        const partyIdStr = member?.politicalPartyId || '';

        return {
          id: vote.id,
          memberName: member?.fullName || (memberIdStr ? `Miembro (${memberIdStr.substring(0, 8)})` : 'Sin ID'),
          partyName: party?.name || (partyIdStr ? `Partido (${partyIdStr.substring(0, 8)})` : 'Sin partido'),
          partyAcronym: party?.acronym || '',
          valueVote: vote.valueVote,
          comment: vote.comment,
          createdAt: vote.createdAt,
          result: result,
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
