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
import { MunicipalCouncilSession, CreateMunicipalCouncilSessionDTO, SessionMember, SessionBancada } from '../../domain/types/municipal-council-session';
import { logger } from '../logger/logger';

interface DjangoSessionMemberResponse {
  id: string;
  id_member: string;
  member_name: string;
  member_document: string;
  member_email: string;
  is_present: boolean;
  arrival_time?: string;
}

interface DjangoSessionBancadaResponse {
  id: string;
  id_bancada: string;
  bancada_tipo_curul: string;
  bancada_profesion: string;
  bancada_correo: string;
}

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
  members?: DjangoSessionMemberResponse[];
  bancadas?: DjangoSessionBancadaResponse[];
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

      console.log('=== REPO DEBUG: Create session response ===');
      console.log('response.data:', JSON.stringify(response.data, null, 2));
      console.log('response.data.data.id:', response.data.data.id);

      logger.success('DJANGO_SESSION_REPO: Sesion creada exitosamente', {
        id: response.data.data.id,
      });

      const result = this.mapToEntity(response.data.data);
      console.log('=== REPO DEBUG: Mapped entity ===');
      console.log('result.id:', result.id);
      
      return result;
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

      return responseData.data.map(item => this.mapToEntity(item));
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
        `${this.endpoint}${id}/`
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
        `${this.endpoint}${id}/`,
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
      await djangoApi.delete(`${this.endpoint}${id}/`);

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

  async addMember(sessionId: string, memberId: string): Promise<void> {
    const url = `${this.endpoint}${sessionId}/members/`;
    const body = { id_member: memberId };
    
    console.log('=== REPO DEBUG: addMember ===');
    console.log('URL:', url);
    console.log('Body:', body);
    
    logger.info('DJANGO_SESSION_REPO: Agregando miembro a sesion', { sessionId, memberId, url });

    try {
      const response = await djangoApi.post(url, body);
      console.log('=== REPO DEBUG: addMember SUCCESS ===', response.data);
      logger.success('DJANGO_SESSION_REPO: Miembro agregado', { sessionId, memberId });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('=== REPO DEBUG: addMember AXIOS ERROR ===', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const message = error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error al agregar miembro', { message });
        throw new Error(message);
      }
      console.error('=== REPO DEBUG: addMember UNKNOWN ERROR ===', error);
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async removeMember(sessionId: string, memberId: string): Promise<void> {
    logger.info('DJANGO_SESSION_REPO: Removiendo miembro de sesion', { sessionId, memberId });

    try {
      await djangoApi.delete(`${this.endpoint}${sessionId}/members/?member_id=${memberId}`);
      logger.success('DJANGO_SESSION_REPO: Miembro removido', { sessionId, memberId });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error al remover miembro', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAvailableMembers(sessionId: string): Promise<{ id: string; fullName: string; documentNumber: string }[]> {
    logger.info('DJANGO_SESSION_REPO: Obteniendo miembros disponibles', { sessionId });

    try {
      const response = await djangoApi.get<{ success: boolean; data: { id: string; full_name: string; document_number: string }[] }>(
        `${this.endpoint}${sessionId}/members/available/`
      );

      return response.data.data?.map(item => ({
        id: item.id,
        fullName: item.full_name,
        documentNumber: item.document_number,
      })) || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error al obtener miembros disponibles', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async addBancada(sessionId: string, bancadaId: string): Promise<void> {
    const url = `${this.endpoint}${sessionId}/bancadas/`;
    const body = { id_bancada: bancadaId };
    
    console.log('=== REPO DEBUG: addBancada ===');
    console.log('URL:', url);
    console.log('Body:', body);
    
    logger.info('DJANGO_SESSION_REPO: Agregando bancada a sesion', { sessionId, bancadaId, url });

    try {
      const response = await djangoApi.post(url, body);
      console.log('=== REPO DEBUG: addBancada SUCCESS ===', response.data);
      logger.success('DJANGO_SESSION_REPO: Bancada agregada', { sessionId, bancadaId });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('=== REPO DEBUG: addBancada AXIOS ERROR ===', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const message = error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error al agregar bancada', { message });
        throw new Error(message);
      }
      console.error('=== REPO DEBUG: addBancada UNKNOWN ERROR ===', error);
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async removeBancada(sessionId: string, bancadaId: string): Promise<void> {
    logger.info('DJANGO_SESSION_REPO: Removiendo bancada de sesion', { sessionId, bancadaId });

    try {
      await djangoApi.delete(`${this.endpoint}${sessionId}/bancadas/?bancada_id=${bancadaId}`);
      logger.success('DJANGO_SESSION_REPO: Bancada removida', { sessionId, bancadaId });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error al remover bancada', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAvailableBancadas(sessionId: string): Promise<{ id: string; tipoCurul: string; profesion: string }[]> {
    logger.info('DJANGO_SESSION_REPO: Obteniendo bancadas disponibles', { sessionId });

    try {
      const response = await djangoApi.get<{ success: boolean; data: { id: string; tipo_curul: string; profesion: string }[] }>(
        `${this.endpoint}${sessionId}/bancadas/available/`
      );

      return response.data.data?.map(item => ({
        id: item.id,
        tipoCurul: item.tipo_curul,
        profesion: item.profesion,
      })) || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error al obtener bancadas disponibles', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAllMembers(): Promise<{ id: string; fullName: string; documentNumber: string }[]> {
    logger.info('DJANGO_SESSION_REPO: Obteniendo todos los miembros');

    try {
      const response = await djangoApi.get<{ success: boolean; data: { id: string; full_name: string; document_number: string }[] }>(
        '/api/v1/municipal-council-sessions/members/'
      );

      return response.data.data?.map(item => ({
        id: item.id,
        fullName: item.full_name,
        documentNumber: item.document_number,
      })) || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error al obtener miembros', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAllBancadas(): Promise<{ id: string; tipoCurul: string; profesion: string; correo?: string }[]> {
    logger.info('DJANGO_SESSION_REPO: Obteniendo todas las bancadas');

    try {
      const response = await djangoApi.get<{ success: boolean; data: { id: string; tipo_curul: string; profesion: string; correo_institucional?: string }[] }>(
        '/api/v1/municipal-council-sessions/bancadas/'
      );

      return response.data.data?.map(item => ({
        id: item.id,
        tipoCurul: item.tipo_curul,
        profesion: item.profesion,
        correo: item.correo_institucional,
      })) || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        logger.error('DJANGO_SESSION_REPO: Error al obtener bancadas', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_SESSION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  private mapToEntity(data: DjangoSessionResponse): MunicipalCouncilSession {
    const mapMembers = (members: DjangoSessionMemberResponse[] | undefined): SessionMember[] => {
      if (!members) return [];
      return members.map(m => ({
        id: m.id,
        idMember: m.id_member,
        memberName: m.member_name,
        memberDocument: m.member_document,
        memberEmail: m.member_email,
        isPresent: m.is_present,
        arrivalTime: m.arrival_time,
      }));
    };

    const mapBancadas = (bancadas: DjangoSessionBancadaResponse[] | undefined): SessionBancada[] => {
      if (!bancadas) return [];
      return bancadas.map(b => ({
        id: b.id,
        idBancada: b.id_bancada,
        bancadaTipoCurul: b.bancada_tipo_curul,
        bancadaProfesion: b.bancada_profesion,
        bancadaCorreo: b.bancada_correo,
      }));
    };

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
      members: mapMembers(data.members),
      bancadas: mapBancadas(data.bancadas),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
