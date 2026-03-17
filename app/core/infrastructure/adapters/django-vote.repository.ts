/**
 * Adaptador de Repositorio de Voto usando Django REST API
 * Implementa el puerto IVoteRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IVoteRepository
 * - Open/Closed: abierto para extensión
 */

import axios from 'axios';
import { djangoApi } from '../../infrastructure/api/django-client';
import { IVoteRepository } from '../../domain/ports/vote-repository.port';
import { Vote, CreateVoteDTO } from '../../domain/types/vote';
import { logger } from '../logger/logger';

interface DjangoVoteResponse {
  id: string;
  id_consult: string;
  id_number: string;
  id_party: string;
  id_auth: string;
  value_vote: boolean;
  comment: string | null;
  created_at: string;
}

interface CreateVoteApiResponse {
  success: boolean;
  message?: string;
  data?: DjangoVoteResponse;
  error?: string;
}

export class DjangoVoteRepository implements IVoteRepository {
  private readonly endpoint = '/api/vote';

  async create(vote: CreateVoteDTO): Promise<Vote> {
    logger.info('DJANGO_VOTE_REPO: Creando voto', { 
      consultationId: vote.consultationId,
      memberId: vote.memberId,
      partyId: vote.partyId
    });

    const voteData = {
      id_consult: vote.consultationId,
      id_member: vote.memberId,
      id_party: vote.partyId,
      id_auth: vote.authId || 'anonymous',
      value_vote: vote.valueVote,
      comment: vote.comment || null,
    };

    console.log("=== SENDING VOTE DATA ===", JSON.stringify(voteData, null, 2));

    try {
      const response = await djangoApi.post<CreateVoteApiResponse>(
        this.endpoint + '/',
        voteData
      );

      console.log("=== VOTE RESPONSE ===", response.data);

      if (!response.data.success) {
        const errorMsg = response.data.error || response.data.message || 'Error al crear el voto';
        logger.error('DJANGO_VOTE_REPO: Error de la API', { error: errorMsg });
        throw new Error(errorMsg);
      }

      if (!response.data.data) {
        logger.error('DJANGO_VOTE_REPO: No se recibieron datos');
        throw new Error('Error al crear el voto');
      }

      logger.success('DJANGO_VOTE_REPO: Voto creado exitosamente', {
        id: response.data.data.id,
      });

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_VOTE_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_VOTE_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getByConsultation(consultationId: string): Promise<Vote[]> {
    logger.info('DJANGO_VOTE_REPO: Obteniendo votos por consulta', { consultationId });

    try {
      const response = await djangoApi.get<{ success: boolean; data: DjangoVoteResponse[]; count: number }>(
        `${this.endpoint}/?consultation_id=${consultationId}`
      );

      const votes = response.data.data || [];
      logger.success('DJANGO_VOTE_REPO: Votos obtenidos', {
        count: votes.length,
      });

      return votes.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_VOTE_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_VOTE_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAll(): Promise<Vote[]> {
    logger.info('DJANGO_VOTE_REPO: Obteniendo todos los votos');

    try {
      const response = await djangoApi.get<{ success: boolean; data: DjangoVoteResponse[]; count: number }>(this.endpoint + '/');

      const votes = response.data.data || [];
      logger.success('DJANGO_VOTE_REPO: Todos los votos obtenidos', {
        count: votes.length,
      });

      return votes.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_VOTE_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_VOTE_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getByMember(documentNumber: string): Promise<Vote[]> {
    logger.info('DJANGO_VOTE_REPO: Obteniendo votos por miembro', { documentNumber });

    try {
      const response = await djangoApi.get<{ success: boolean; data: DjangoVoteResponse[]; count: number }>(
        `${this.endpoint}/?member_document=${documentNumber}`
      );

      const votes = response.data.data || [];
      logger.success('DJANGO_VOTE_REPO: Votos obtenidos por miembro', {
        count: votes.length,
      });

      return votes.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_VOTE_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_VOTE_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async existsByMemberAndConsult(memberId: string, consultationId: string): Promise<boolean> {
    logger.info('DJANGO_VOTE_REPO: Verificando si existe voto', { memberId, consultationId });

    try {
      const response = await djangoApi.get<{ success: boolean; has_voted: boolean }>(
        `${this.endpoint}/?member_id=${memberId}&consultation_id=${consultationId}`
      );

      return response.data.has_voted || false;
    } catch (error) {
      logger.error('DJANGO_VOTE_REPO: Error al verificar voto', { error });
      return false;
    }
  }

  private mapToEntity(data: DjangoVoteResponse): Vote {
    return {
      id: data.id,
      consultationId: data.id_consult,
      memberId: data.id_number,
      partyId: data.id_party,
      authId: data.id_auth,
      valueVote: data.value_vote,
      comment: data.comment || undefined,
      createdAt: data.created_at,
    };
  }
}
