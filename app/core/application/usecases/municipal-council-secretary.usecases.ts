/**
 * Casos de Uso - Secretario de Consejo Municipal
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de secretario de consejo municipal
 * - Dependency Inversion: depende de IMunicipalCouncilSecretaryRepository
 */

import { IMunicipalCouncilSecretaryRepository } from '../../domain/ports/municipal-council-secretary-repository.port';
import { MunicipalCouncilSecretary, CreateMunicipalCouncilSecretaryDTO } from '../../domain/types/municipal-council-secretary';
import { logger } from '../../infrastructure/logger/logger';

export class CreateMunicipalCouncilSecretaryUseCase {
  constructor(private readonly repository: IMunicipalCouncilSecretaryRepository) {}

  async execute(data: {
    full_name: string;
    document_type: string;
    document_id: string;
    exact_position: string;
    administrative_act: string;
    possession_date: string;
    legal_period: string;
    professional_title?: string;
    performance_type: string;
    institutional_email: string;
    digital_signature?: string;
  }): Promise<MunicipalCouncilSecretary> {
    logger.info('USECASE: Iniciando CreateMunicipalCouncilSecretaryUseCase', { 
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

    if (!data.exact_position) {
      logger.warning('USECASE: Cargo exacto no seleccionado');
      throw new Error('El cargo exacto es requerido');
    }

    if (!data.administrative_act || data.administrative_act.trim().length < 3) {
      logger.warning('USECASE: Acto administrativo inválido');
      throw new Error('El acto administrativo de elección es requerido');
    }

    if (!data.possession_date || data.possession_date.trim().length < 3) {
      logger.warning('USECASE: Fecha de posesión no proporcionada');
      throw new Error('La fecha de posesión es requerida');
    }

    if (!data.legal_period || data.legal_period.trim().length < 4) {
      logger.warning('USECASE: Período legal inválido');
      throw new Error('El período legal debe tener al menos 4 caracteres');
    }

    if (!data.performance_type) {
      logger.warning('USECASE: Tipo de desempeño no seleccionado');
      throw new Error('La calidad de actuación es requerida');
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
      const dto: CreateMunicipalCouncilSecretaryDTO = {
        full_name: data.full_name,
        document_type: data.document_type,
        document_id: data.document_id,
        exact_position: data.exact_position,
        administrative_act: data.administrative_act,
        possession_date: data.possession_date,
        legal_period: data.legal_period,
        professional_title: data.professional_title,
        performance_type: data.performance_type,
        institutional_email: data.institutional_email,
        digital_signature: data.digital_signature,
      };

      const result = await this.repository.create(dto);
      logger.success('USECASE: CreateMunicipalCouncilSecretaryUseCase completado', { 
        id: result.id 
      });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en CreateMunicipalCouncilSecretaryUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetAllMunicipalCouncilSecretariesUseCase {
  constructor(private readonly repository: IMunicipalCouncilSecretaryRepository) {}

  async execute(): Promise<MunicipalCouncilSecretary[]> {
    logger.info('USECASE: Iniciando GetAllMunicipalCouncilSecretariesUseCase');

    try {
      const result = await this.repository.getAll();
      logger.success('USECASE: GetAllMunicipalCouncilSecretariesUseCase completado', { 
        count: result.length 
      });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetAllMunicipalCouncilSecretariesUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetMunicipalCouncilSecretaryByIdUseCase {
  constructor(private readonly repository: IMunicipalCouncilSecretaryRepository) {}

  async execute(id: string): Promise<MunicipalCouncilSecretary> {
    logger.info('USECASE: Iniciando GetMunicipalCouncilSecretaryByIdUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID no proporcionado');
      throw new Error('El ID del secretario es requerido');
    }

    try {
      const result = await this.repository.getById(id);
      
      if (!result) {
        logger.warning('USECASE: Secretario no encontrado');
        throw new Error('Secretario de consejo municipal no encontrado');
      }

      logger.success('USECASE: GetMunicipalCouncilSecretaryByIdUseCase completado', { id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetMunicipalCouncilSecretaryByIdUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class DeleteMunicipalCouncilSecretaryUseCase {
  constructor(private readonly repository: IMunicipalCouncilSecretaryRepository) {}

  async execute(id: string): Promise<void> {
    logger.info('USECASE: Iniciando DeleteMunicipalCouncilSecretaryUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID no proporcionado');
      throw new Error('El ID del secretario es requerido');
    }

    try {
      await this.repository.delete(id);
      logger.success('USECASE: DeleteMunicipalCouncilSecretaryUseCase completado', { id });
    } catch (error) {
      logger.error('USECASE: Error en DeleteMunicipalCouncilSecretaryUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
