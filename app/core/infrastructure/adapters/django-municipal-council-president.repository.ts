/**
 * Adaptador de Repositorio - Presidente de Consejo Municipal usando Django REST API
 * Implementa el puerto IMunicipalCouncilPresidentRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación
 * - Open/Closed: abierto para extensión
 */

import axios from 'axios';
import { djangoApi } from '../../infrastructure/api/django-client';
import { IMunicipalCouncilPresidentRepository } from '../../domain/ports/municipal-council-president-repository.port';
import { MunicipalCouncilPresident, CreateMunicipalCouncilPresidentDTO } from '../../domain/types/municipal-council-president';
import { logger } from '../logger/logger';

interface DjangoPresidentResponse {
  id: string;
  full_name: string;
  document_type: string;
  document_id: string;
  board_position: string;
  political_party: string;
  election_period: string;
  presidency_type: string;
  position_time: string;
  institutional_email: string;
  digital_signature: string | null;
  fingerprint: string | null;
  created_at: string;
  updated_at: string;
}

interface CreatePresidentApiResponse {
  success: boolean;
  message?: string;
  data?: DjangoPresidentResponse;
  error?: string;
}

interface ListPresidentsApiResponse {
  success: boolean;
  data?: DjangoPresidentResponse[];
  count?: number;
}

export class DjangoMunicipalCouncilPresidentRepository implements IMunicipalCouncilPresidentRepository {
  private readonly endpoint = '/api/v1/municipal-council-presidents/';

  async create(president: CreateMunicipalCouncilPresidentDTO): Promise<MunicipalCouncilPresident> {
    logger.info('DJANGO_PRESIDENT_REPO: Creando presidente de consejo municipal', { 
      fullName: president.full_name 
    });

    try {
      const response = await djangoApi.post<CreatePresidentApiResponse>(
        this.endpoint,
        president
      );

      if (response.data.error) {
        logger.error('DJANGO_PRESIDENT_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      if (!response.data.data) {
        logger.error('DJANGO_PRESIDENT_REPO: No se recibieron datos');
        throw new Error('Error al crear el presidente de consejo municipal');
      }

      logger.success('DJANGO_PRESIDENT_REPO: Presidente creado exitosamente', {
        id: response.data.data.id,
      });

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.response?.data?.message || error.message;
        logger.error('DJANGO_PRESIDENT_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PRESIDENT_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAll(): Promise<MunicipalCouncilPresident[]> {
    logger.info('DJANGO_PRESIDENT_REPO: Obteniendo todos los presidentes');

    try {
      const response = await djangoApi.get<ListPresidentsApiResponse>(this.endpoint);

      if (!response.data.data) {
        logger.warning('DJANGO_PRESIDENT_REPO: No se recibieron datos');
        return [];
      }

      logger.success('DJANGO_PRESIDENT_REPO: Presidentes obtenidos', {
        count: response.data.data.length,
      });

      return response.data.data.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PRESIDENT_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PRESIDENT_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getById(id: string): Promise<MunicipalCouncilPresident | null> {
    logger.info('DJANGO_PRESIDENT_REPO: Obteniendo presidente por ID', { id });

    try {
      const response = await djangoApi.get<{ success: boolean; data: DjangoPresidentResponse }>(
        `${this.endpoint}/${id}/`
      );

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          logger.warning('DJANGO_PRESIDENT_REPO: Presidente no encontrado', { id });
          return null;
        }
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PRESIDENT_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PRESIDENT_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async update(id: string, president: Partial<CreateMunicipalCouncilPresidentDTO>): Promise<MunicipalCouncilPresident> {
    logger.info('DJANGO_PRESIDENT_REPO: Actualizando presidente', { id });

    try {
      const response = await djangoApi.put<CreatePresidentApiResponse>(
        `${this.endpoint}/${id}/`,
        president
      );

      if (response.data.error) {
        logger.error('DJANGO_PRESIDENT_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      logger.success('DJANGO_PRESIDENT_REPO: Presidente actualizado', { id });

      return this.mapToEntity(response.data.data!);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PRESIDENT_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PRESIDENT_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    logger.info('DJANGO_PRESIDENT_REPO: Eliminando presidente', { id });

    try {
      await djangoApi.delete(`${this.endpoint}/${id}/`);

      logger.success('DJANGO_PRESIDENT_REPO: Presidente eliminado', { id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PRESIDENT_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PRESIDENT_REPO: Error desconocido', { error });
      throw error;
    }
  }

  private mapToEntity(data: DjangoPresidentResponse): MunicipalCouncilPresident {
    return {
      id: data.id,
      fullName: data.full_name,
      documentType: data.document_type as MunicipalCouncilPresident['documentType'],
      documentId: data.document_id,
      boardPosition: data.board_position,
      politicalParty: data.political_party,
      electionPeriod: data.election_period,
      presidencyType: data.presidency_type as MunicipalCouncilPresident['presidencyType'],
      positionTime: data.position_time,
      institutionalEmail: data.institutional_email,
      digitalSignature: data.digital_signature || undefined,
      fingerprint: data.fingerprint || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
