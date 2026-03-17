/**
 * Adaptador de Repositorio - Sesion de Consejo Municipal usando Django REST API
 * Implementa el puerto IMunicipalCouncilSessionRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación
 * - Open/Closed: abierto para extensión
 */

import axios from 'axios';
import { djangoApi } from '../../infrastructure/api/django-client';
import { IMunicipalCouncilSessionRepository } from '../../domain/ports/municipal-council-session-repository.port';
import { MunicipalCouncilSession, CreateMunicipalCouncilSessionDTO } from '../../domain/types/municipal-council-session';
import { logger } from '../logger/logger';

interface DjangoSessionResponse {
  id: string;
  title_session: string;
  type_session: string;
  status_session: string;
  date_hour_start: string;
  date_hour_end: string;
  modality: string;
  place_enclosure: string;
  orden_day: string;
  quorum_required: number;
  id_president: string;
  id_secretary: string;
  created_at: string;
  updated_at: string;
}

interface CreateSessionApiResponse {
  success: boolean;
  message?: string;
  data?: DjangoSessionResponse;
  error?: string;
}

interface ListSessionsApiResponse {
  success: boolean;
  data?: DjangoSessionResponse[];
  count?: number;
}

export class DjangoMunicipalCouncilSessionRepository implements IMunicipalCouncilSessionRepository {
  private readonly endpoint = '/api/v1/municipal-council-sessions/';

  async create(session: CreateMunicipalCouncilSessionDTO): Promise<MunicipalCouncilSession> {
    logger.info('DJANGO_SESSION_REPO: Creando sesion de consejo municipal', { 
      titleSession: session.title_session 
    });

    try {
      const response = await djangoApi.post<CreateSessionApiResponse>(
        this.endpoint,
        session
      );

      if (response.data.error) {
        logger.error('DJANGO_SESSION_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      if (!response.data.data) {
        logger.error('DJANGO_SESSION_REPO: No se recibieron datos');
        throw new Error('Error al crear la sesion de consejo municipal');
      }

      logger.success('DJANGO_SESSION_REPO: Sesion creada exitosamente', {
        id: response.data.data.id,
      });

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.response?.data?.message || error.message;
        logger.error('DJANGO_SESSION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAll(): Promise<MunicipalCouncilSession[]> {
    logger.info('DJANGO_SESSION_REPO: Obteniendo todas las sesiones');

    try {
      const response = await djangoApi.get<ListSessionsApiResponse>(this.endpoint);

      const responseData = response.data;
      
      if (!responseData.data) {
        logger.warning('DJANGO_SESSION_REPO: No se recibieron datos');
        return [];
      }

      logger.success('DJANGO_SESSION_REPO: Sesiones obtenidas', {
        count: responseData.data.length,
      });

      return responseData.data.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getById(id: string): Promise<MunicipalCouncilSession | null> {
    logger.info('DJANGO_SESSION_REPO: Obteniendo sesion por ID', { id });

    try {
      const response = await djangoApi.get<{ success: boolean; data: DjangoSessionResponse }>(
        `${this.endpoint}/${id}/`
      );

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          logger.warning('DJANGO_SESSION_REPO: Sesion no encontrada', { id });
          return null;
        }
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_SESSION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async update(id: string, session: Partial<CreateMunicipalCouncilSessionDTO>): Promise<MunicipalCouncilSession> {
    logger.info('DJANGO_SESSION_REPO: Actualizando sesion', { id });

    try {
      const response = await djangoApi.put<CreateSessionApiResponse>(
        `${this.endpoint}/${id}/`,
        session
      );

      if (response.data.error) {
        logger.error('DJANGO_SESSION_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      logger.success('DJANGO_SESSION_REPO: Sesion actualizada', { id });

      return this.mapToEntity(response.data.data!);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_SESSION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    logger.info('DJANGO_SESSION_REPO: Eliminando sesion', { id });

    try {
      await djangoApi.delete(`${this.endpoint}/${id}/`);

      logger.success('DJANGO_SESSION_REPO: Sesion eliminada', { id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_SESSION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  private mapToEntity(data: DjangoSessionResponse): MunicipalCouncilSession {
    return {
      id: data.id,
      titleSession: data.title_session,
      typeSession: data.type_session as MunicipalCouncilSession['typeSession'],
      statusSession: data.status_session as MunicipalCouncilSession['statusSession'],
      dateHourStart: data.date_hour_start,
      dateHourEnd: data.date_hour_end,
      modality: data.modality as MunicipalCouncilSession['modality'],
      placeEnclosure: data.place_enclosure,
      ordenDay: data.orden_day,
      quorumRequired: data.quorum_required,
      idPresident: data.id_president,
      idSecretary: data.id_secretary,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
