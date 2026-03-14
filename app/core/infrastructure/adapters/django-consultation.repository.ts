/**
 * Adaptador de Repositorio de Consulta Popular usando Django REST API
 * Implementa el puerto IConsultationRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IConsultationRepository
 * - Open/Closed: abierto para extensión
 */

import axios from 'axios';
import { djangoApi } from '../../infrastructure/api/django-client';
import { IConsultationRepository } from '../../domain/ports/consultation-repository.port';
import { Consultation, CreateConsultationDTO, Question } from '../../domain/types/consultation';
import { logger } from '../logger/logger';

interface DjangoQuestionResponse {
  id: string;
  text: string;
  question_type: string;
  options: string[];
  required: boolean;
}

interface DjangoConsultationResponse {
  id: string;
  title: string;
  description: string;
  questions: DjangoQuestionResponse[];
  proprietary_representation: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CreateConsultationApiResponse {
  id?: string;
  message?: string;
  error?: string;
}

export class DjangoConsultationRepository implements IConsultationRepository {
  private readonly endpoint = '/api/consultation-popular';

  async create(consultation: CreateConsultationDTO): Promise<Consultation> {
    logger.info('DJANGO_CONSULTATION_REPO: Creando consulta', { title: consultation.title });

    const consultationData = {
      title: consultation.title,
      description: consultation.description,
      questions: consultation.questions.map((q) => ({
        text: q.text,
        question_type: q.questionType,
        options: q.options || [],
        required: q.required,
      })),
      proprietary_representation: consultation.proprietaryRepresentation,
      status: consultation.status,
    };

    try {
      const response = await djangoApi.post<CreateConsultationApiResponse>(
        this.endpoint + '/',
        consultationData
      );

      if (response.data.error) {
        logger.error('DJANGO_CONSULTATION_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      logger.success('DJANGO_CONSULTATION_REPO: Consulta creada exitosamente', {
        id: response.data.id,
      });

      return this.mapToEntity(response.data as unknown as DjangoConsultationResponse);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_CONSULTATION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_CONSULTATION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAll(): Promise<Consultation[]> {
    logger.info('DJANGO_CONSULTATION_REPO: Obteniendo todas las consultas');

    try {
      const response = await djangoApi.get<DjangoConsultationResponse[]>(this.endpoint + '/');

      logger.success('DJANGO_CONSULTATION_REPO: Consultas obtenidas', {
        count: response.data.length,
      });

      return response.data.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_CONSULTATION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_CONSULTATION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getById(id: string): Promise<Consultation | null> {
    logger.info('DJANGO_CONSULTATION_REPO: Obteniendo consulta por ID', { id });

    try {
      const response = await djangoApi.get<DjangoConsultationResponse>(
        `${this.endpoint}/${id}/`
      );

      return this.mapToEntity(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          logger.warning('DJANGO_CONSULTATION_REPO: Consulta no encontrada', { id });
          return null;
        }
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_CONSULTATION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_CONSULTATION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async update(id: string, consultation: Partial<CreateConsultationDTO>): Promise<Consultation> {
    logger.info('DJANGO_CONSULTATION_REPO: Actualizando consulta', { id });

    const updateData: Record<string, unknown> = {};

    if (consultation.title) updateData.title = consultation.title;
    if (consultation.description) updateData.description = consultation.description;
    if (consultation.questions) {
      updateData.questions = consultation.questions.map((q) => ({
        text: q.text,
        question_type: q.questionType,
        options: q.options || [],
        required: q.required,
      }));
    }
    if (consultation.proprietaryRepresentation) {
      updateData.proprietary_representation = consultation.proprietaryRepresentation;
    }
    if (consultation.status) updateData.status = consultation.status;

    try {
      const response = await djangoApi.patch<DjangoConsultationResponse>(
        `${this.endpoint}/${id}/`,
        updateData
      );

      logger.success('DJANGO_CONSULTATION_REPO: Consulta actualizada', { id });

      return this.mapToEntity(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_CONSULTATION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_CONSULTATION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async publish(id: string): Promise<Consultation> {
    logger.info('DJANGO_CONSULTATION_REPO: Publicando consulta', { id });

    try {
      const response = await djangoApi.post<DjangoConsultationResponse>(
        `${this.endpoint}/${id}/publish/`
      );

      logger.success('DJANGO_CONSULTATION_REPO: Consulta publicada', { id });

      return this.mapToEntity(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_CONSULTATION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_CONSULTATION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async close(id: string): Promise<Consultation> {
    logger.info('DJANGO_CONSULTATION_REPO: Cerrando consulta', { id });

    try {
      const response = await djangoApi.post<DjangoConsultationResponse>(
        `${this.endpoint}/${id}/close/`
      );

      logger.success('DJANGO_CONSULTATION_REPO: Consulta cerrada', { id });

      return this.mapToEntity(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_CONSULTATION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_CONSULTATION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    logger.info('DJANGO_CONSULTATION_REPO: Eliminando consulta', { id });

    try {
      await djangoApi.delete(`${this.endpoint}/${id}/`);

      logger.success('DJANGO_CONSULTATION_REPO: Consulta eliminada', { id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_CONSULTATION_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_CONSULTATION_REPO: Error desconocido', { error });
      throw error;
    }
  }

  private mapToEntity(data: DjangoConsultationResponse): Consultation {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      questions: (data.questions || []).map((q) => ({
        id: q.id,
        text: q.text,
        questionType: q.question_type as Question['questionType'],
        options: q.options,
        required: q.required,
      })),
      proprietaryRepresentation: data.proprietary_representation,
      status: data.status as Consultation['status'],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
