/**
 * Casos de Uso - Presidente de Consejo Municipal
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de presidente de consejo municipal
 * - Dependency Inversion: depende de IMunicipalCouncilPresidentRepository
 */

import { IMunicipalCouncilPresidentRepository } from '../../domain/ports/municipal-council-president-repository.port';
import { MunicipalCouncilPresident, CreateMunicipalCouncilPresidentDTO } from '../../domain/types/municipal-council-president';
import { logger } from '../../infrastructure/logger/logger';

export class CreateMunicipalCouncilPresidentUseCase {
  constructor(private readonly repository: IMunicipalCouncilPresidentRepository) {}

  async execute(data: {
    full_name: string;
    document_type: string;
    document_id: string;
    board_position: string;
    political_party: string;
    election_period: string;
    presidency_type: string;
    position_time: string;
    institutional_email: string;
    digital_signature?: string;
    fingerprint?: string;
  }): Promise<MunicipalCouncilPresident> {
    logger.info('USECASE: Iniciando CreateMunicipalCouncilPresidentUseCase', { 
      fullName: data.full_name 
    });

    if (!data.full_name || data.full_name.trim().length < 3) {
      logger.warning('USECASE: Nombre completo inválido');
      throw new Error('El nombre completo debe tener al menos 3 caracteres');
    }

    if (!data.document_type) {
      logger.warning('USECASE: Tipo de documento no seleccionado');
      throw new Error('El tipo de documento es requerido');
    }

    if (!data.document_id || data.document_id.trim().length < 5) {
      logger.warning('USECASE: Documento de identidad inválido');
      throw new Error('El documento de identidad debe tener al menos 5 caracteres');
    }

    if (!data.board_position || data.board_position.trim().length < 3) {
      logger.warning('USECASE: Cargo de mesa inválido');
      throw new Error('El cargo de la mesa debe tener al menos 3 caracteres');
    }

    if (!data.political_party) {
      logger.warning('USECASE: Partido político no seleccionado');
      throw new Error('El partido político es requerido');
    }

    if (!data.election_period || data.election_period.trim().length < 4) {
      logger.warning('USECASE: Período de elección inválido');
      throw new Error('El período de elección debe tener al menos 4 caracteres');
    }

    if (!data.presidency_type) {
      logger.warning('USECASE: Tipo de presidencia no seleccionado');
      throw new Error('La calidad de presidencia es requerida');
    }

    if (!data.position_time || data.position_time.trim().length < 3) {
      logger.warning('USECASE: Hora de posición inválida');
      throw new Error('La hora de toma de posición debe tener al menos 3 caracteres');
    }

    if (!data.institutional_email || data.institutional_email.trim().length === 0) {
      logger.warning('USECASE: Correo institucional no proporcionado');
      throw new Error('El correo institucional es requerido');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.institutional_email)) {
      logger.warning('USECASE: Formato de correo institucional inválido');
      throw new Error('El correo institucional no tiene un formato válido');
    }

    try {
      const dto: CreateMunicipalCouncilPresidentDTO = {
        full_name: data.full_name,
        document_type: data.document_type,
        document_id: data.document_id,
        board_position: data.board_position,
        political_party: data.political_party,
        election_period: data.election_period,
        presidency_type: data.presidency_type,
        position_time: data.position_time,
        institutional_email: data.institutional_email,
        digital_signature: data.digital_signature,
        fingerprint: data.fingerprint,
      };

      const result = await this.repository.create(dto);
      logger.success('USECASE: CreateMunicipalCouncilPresidentUseCase completado', { 
        id: result.id 
      });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en CreateMunicipalCouncilPresidentUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetAllMunicipalCouncilPresidentsUseCase {
  constructor(private readonly repository: IMunicipalCouncilPresidentRepository) {}

  async execute(): Promise<MunicipalCouncilPresident[]> {
    logger.info('USECASE: Iniciando GetAllMunicipalCouncilPresidentsUseCase');

    try {
      const result = await this.repository.getAll();
      logger.success('USECASE: GetAllMunicipalCouncilPresidentsUseCase completado', { 
        count: result.length 
      });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetAllMunicipalCouncilPresidentsUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetMunicipalCouncilPresidentByIdUseCase {
  constructor(private readonly repository: IMunicipalCouncilPresidentRepository) {}

  async execute(id: string): Promise<MunicipalCouncilPresident> {
    logger.info('USECASE: Iniciando GetMunicipalCouncilPresidentByIdUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID no proporcionado');
      throw new Error('El ID del presidente es requerido');
    }

    try {
      const result = await this.repository.getById(id);
      
      if (!result) {
        logger.warning('USECASE: Presidente no encontrado');
        throw new Error('Presidente de consejo municipal no encontrado');
      }

      logger.success('USECASE: GetMunicipalCouncilPresidentByIdUseCase completado', { id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetMunicipalCouncilPresidentByIdUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class DeleteMunicipalCouncilPresidentUseCase {
  constructor(private readonly repository: IMunicipalCouncilPresidentRepository) {}

  async execute(id: string): Promise<void> {
    logger.info('USECASE: Iniciando DeleteMunicipalCouncilPresidentUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID no proporcionado');
      throw new Error('El ID del presidente es requerido');
    }

    try {
      await this.repository.delete(id);
      logger.success('USECASE: DeleteMunicipalCouncilPresidentUseCase completado', { id });
    } catch (error) {
      logger.error('USECASE: Error en DeleteMunicipalCouncilPresidentUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
