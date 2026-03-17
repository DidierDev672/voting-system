/**
 * Casos de Uso - Sesion de Consejo Municipal
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de sesion de consejo municipal
 * - Dependency Inversion: depende de IMunicipalCouncilSessionRepository
 */

import { IMunicipalCouncilSessionRepository } from '../../domain/ports/municipal-council-session-repository.port';
import { MunicipalCouncilSession, CreateMunicipalCouncilSessionDTO } from '../../domain/types/municipal-council-session';
import { logger } from '../../infrastructure/logger/logger';

export class CreateMunicipalCouncilSessionUseCase {
  constructor(private readonly repository: IMunicipalCouncilSessionRepository) {}

  async execute(data: {
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
  }): Promise<MunicipalCouncilSession> {
    logger.info('USECASE: Iniciando CreateMunicipalCouncilSessionUseCase', { 
      titleSession: data.title_session 
    });

    if (!data.title_session || data.title_session.trim().length < 3) {
      logger.warning('USECASE: Titulo de sesion inválido');
      throw new Error('El título de la sesión debe tener al menos 3 caracteres');
    }

    if (!data.type_session) {
      logger.warning('USECASE: Tipo de sesion no seleccionado');
      throw new Error('El tipo de sesión es requerido');
    }

    if (!data.status_session) {
      logger.warning('USECASE: Estado de sesion no seleccionado');
      throw new Error('El estado de la sesión es requerido');
    }

    if (!data.date_hour_start) {
      logger.warning('USECASE: Fecha de inicio no proporcionada');
      throw new Error('La fecha y hora de inicio es requerida');
    }

    if (!data.date_hour_end) {
      logger.warning('USECASE: Fecha de fin no proporcionada');
      throw new Error('La fecha y hora de fin es requerida');
    }

    if (!data.modality) {
      logger.warning('USECASE: Modalidad no seleccionada');
      throw new Error('La modalidad es requerida');
    }

    if (!data.place_enclosure || data.place_enclosure.trim().length < 3) {
      logger.warning('USECASE: Lugar de enclosure inválido');
      throw new Error('El lugar de enclosure es requerido');
    }

    if (!data.orden_day || data.orden_day.trim().length < 3) {
      logger.warning('USECASE: Orden del dia inválido');
      throw new Error('El orden del día es requerido');
    }

    if (!data.quorum_required || data.quorum_required < 1) {
      logger.warning('USECASE: Quorum requerido inválido');
      throw new Error('El quorum requerido debe ser al menos 1');
    }

    if (!data.id_president) {
      logger.warning('USECASE: Presidente no seleccionado');
      throw new Error('El presidente es requerido');
    }

    if (!data.id_secretary) {
      logger.warning('USECASE: Secretario no seleccionado');
      throw new Error('El secretario es requerido');
    }

    try {
      const dto: CreateMunicipalCouncilSessionDTO = {
        title_session: data.title_session,
        type_session: data.type_session,
        status_session: data.status_session,
        date_hour_start: data.date_hour_start,
        date_hour_end: data.date_hour_end,
        modality: data.modality,
        place_enclosure: data.place_enclosure,
        orden_day: data.orden_day,
        quorum_required: data.quorum_required,
        id_president: data.id_president,
        id_secretary: data.id_secretary,
      };

      const result = await this.repository.create(dto);
      logger.success('USECASE: CreateMunicipalCouncilSessionUseCase completado', { 
        id: result.id 
      });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en CreateMunicipalCouncilSessionUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetAllMunicipalCouncilSessionsUseCase {
  constructor(private readonly repository: IMunicipalCouncilSessionRepository) {}

  async execute(): Promise<MunicipalCouncilSession[]> {
    logger.info('USECASE: Iniciando GetAllMunicipalCouncilSessionsUseCase');

    try {
      const result = await this.repository.getAll();
      logger.success('USECASE: GetAllMunicipalCouncilSessionsUseCase completado', { 
        count: result.length 
      });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetAllMunicipalCouncilSessionsUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
