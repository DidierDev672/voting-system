/**
 * Adaptador de Repositorio - Secretario de Consejo Municipal usando Django REST API
 * Implementa el puerto IMunicipalCouncilSecretaryRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación
 * - Open/Closed: abierto para extensión
 */

import axios from 'axios';
import { djangoApi } from '../../infrastructure/api/django-client';
import { IMunicipalCouncilSecretaryRepository } from '../../domain/ports/municipal-council-secretary-repository.port';
import { MunicipalCouncilSecretary, CreateMunicipalCouncilSecretaryDTO } from '../../domain/types/municipal-council-secretary';
import { logger } from '../logger/logger';

interface DjangoSecretaryResponse {
  id: string;
  full_name: string;
  document_type: string;
  document_id: string;
  exact_position: string;
  administrative_act: string;
  possession_date: string;
  legal_period: string;
  professional_title: string | null;
  performance_type: string;
  institutional_email: string;
  digital_signature: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateSecretaryApiResponse {
  success: boolean;
  message?: string;
  data?: DjangoSecretaryResponse;
  error?: string;
}

interface ListSecretariesApiResponse {
  success: boolean;
  data?: DjangoSecretaryResponse[];
  count?: number;
}

export class DjangoMunicipalCouncilSecretaryRepository implements IMunicipalCouncilSecretaryRepository {
  private readonly endpoint = '/api/v1/municipal-council-secretaries/';

  async create(secretary: CreateMunicipalCouncilSecretaryDTO): Promise<MunicipalCouncilSecretary> {
    logger.info('DJANGO_SECRETARY_REPO: Creando secretario de consejo municipal', { 
      fullName: secretary.full_name 
    });

    try {
      const response = await djangoApi.post<CreateSecretaryApiResponse>(
        this.endpoint,
        secretary
      );

      if (response.data.error) {
        logger.error('DJANGO_SECRETARY_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      if (!response.data.data) {
        logger.error('DJANGO_SECRETARY_REPO: No se recibieron datos');
        throw new Error('Error al crear el secretario de consejo municipal');
      }

      logger.success('DJANGO_SECRETARY_REPO: Secretario creado exitosamente', {
        id: response.data.data.id,
      });

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.response?.data?.message || error.message;
        logger.error('DJANGO_SECRETARY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SECRETARY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAll(): Promise<MunicipalCouncilSecretary[]> {
    logger.info('DJANGO_SECRETARY_REPO: Obteniendo todos los secretarios');

    try {
      const response = await djangoApi.get<ListSecretariesApiResponse>(this.endpoint);

      if (!response.data.data) {
        logger.warning('DJANGO_SECRETARY_REPO: No se recibieron datos');
        return [];
      }

      logger.success('DJANGO_SECRETARY_REPO: Secretarios obtenidos', {
        count: response.data.data.length,
      });

      return response.data.data.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_SECRETARY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SECRETARY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getById(id: string): Promise<MunicipalCouncilSecretary | null> {
    logger.info('DJANGO_SECRETARY_REPO: Obteniendo secretario por ID', { id });

    try {
      const response = await djangoApi.get<{ success: boolean; data: DjangoSecretaryResponse }>(
        `${this.endpoint}/${id}/`
      );

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          logger.warning('DJANGO_SECRETARY_REPO: Secretario no encontrado', { id });
          return null;
        }
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_SECRETARY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SECRETARY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async update(id: string, secretary: Partial<CreateMunicipalCouncilSecretaryDTO>): Promise<MunicipalCouncilSecretary> {
    logger.info('DJANGO_SECRETARY_REPO: Actualizando secretario', { id });

    try {
      const response = await djangoApi.put<CreateSecretaryApiResponse>(
        `${this.endpoint}/${id}/`,
        secretary
      );

      if (response.data.error) {
        logger.error('DJANGO_SECRETARY_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      logger.success('DJANGO_SECRETARY_REPO: Secretario actualizado', { id });

      return this.mapToEntity(response.data.data!);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_SECRETARY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SECRETARY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    logger.info('DJANGO_SECRETARY_REPO: Eliminando secretario', { id });

    try {
      await djangoApi.delete(`${this.endpoint}/${id}/`);

      logger.success('DJANGO_SECRETARY_REPO: Secretario eliminado', { id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_SECRETARY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SECRETARY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  private mapToEntity(data: DjangoSecretaryResponse): MunicipalCouncilSecretary {
    return {
      id: data.id,
      fullName: data.full_name,
      documentType: data.document_type as MunicipalCouncilSecretary['documentType'],
      documentId: data.document_id,
      exactPosition: data.exact_position as MunicipalCouncilSecretary['exactPosition'],
      administrativeAct: data.administrative_act,
      possessionDate: data.possession_date,
      legalPeriod: data.legal_period,
      professionalTitle: data.professional_title || undefined,
      performanceType: data.performance_type as MunicipalCouncilSecretary['performanceType'],
      institutionalEmail: data.institutional_email,
      digitalSignature: data.digital_signature || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
