/**
 * Casos de Uso de Partido Político
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de partido político
 * - Dependency Inversion: depende de IPartyRepository
 */

import { IPartyRepository } from '../../domain/ports/party-repository.port';
import { PoliticalParty, CreatePartyDTO } from '../../domain/types/party';
import { logger } from '../../infrastructure/logger/logger';

export class CreatePartyUseCase {
  constructor(private readonly partyRepository: IPartyRepository) {}

  async execute(party: CreatePartyDTO): Promise<PoliticalParty> {
    logger.info('USECASE: Iniciando CreatePartyUseCase', { name: party.name });

    if (!party.name || party.name.trim().length === 0) {
      logger.warning('USECASE: Nombre de partido inválido');
      throw new Error('El nombre del partido es requerido');
    }

    if (!party.acronym || party.acronym.trim().length === 0) {
      logger.warning('USECASE: Siglas de partido inválidas');
      throw new Error('Las siglas del partido son requeridas');
    }

    if (!party.partyType) {
      logger.warning('USECASE: Tipo de partido no seleccionado');
      throw new Error('El tipo de partido es requerido');
    }

    if (!party.legalRepresentative || party.legalRepresentative.trim().length === 0) {
      logger.warning('USECASE: Representante legal no proporcionado');
      throw new Error('El representante legal es requerido');
    }

    if (!party.representativeId || party.representativeId.trim().length === 0) {
      logger.warning('USECASE: ID de representante no proporcionado');
      throw new Error('El ID del representante es requerido');
    }

    try {
      const result = await this.partyRepository.create(party);
      logger.success('USECASE: CreatePartyUseCase completado', { id: result.id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en CreatePartyUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetAllPartiesUseCase {
  constructor(private readonly partyRepository: IPartyRepository) {}

  async execute(): Promise<PoliticalParty[]> {
    logger.info('USECASE: Iniciando GetAllPartiesUseCase');

    try {
      const result = await this.partyRepository.getAll();
      logger.success('USECASE: GetAllPartiesUseCase completado', { count: result.length });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetAllPartiesUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetPartyByIdUseCase {
  constructor(private readonly partyRepository: IPartyRepository) {}

  async execute(id: string): Promise<PoliticalParty | null> {
    logger.info('USECASE: Iniciando GetPartyByIdUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID de partido no proporcionado');
      throw new Error('El ID del partido es requerido');
    }

    try {
      const result = await this.partyRepository.getById(id);
      logger.success('USECASE: GetPartyByIdUseCase completado', { id, found: !!result });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetPartyByIdUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class UpdatePartyUseCase {
  constructor(private readonly partyRepository: IPartyRepository) {}

  async execute(id: string, party: Partial<CreatePartyDTO>): Promise<PoliticalParty> {
    logger.info('USECASE: Iniciando UpdatePartyUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID de partido no proporcionado');
      throw new Error('El ID del partido es requerido');
    }

    try {
      const result = await this.partyRepository.update(id, party);
      logger.success('USECASE: UpdatePartyUseCase completado', { id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en UpdatePartyUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class DeletePartyUseCase {
  constructor(private readonly partyRepository: IPartyRepository) {}

  async execute(id: string): Promise<void> {
    logger.info('USECASE: Iniciando DeletePartyUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID de partido no proporcionado');
      throw new Error('El ID del partido es requerido');
    }

    try {
      await this.partyRepository.delete(id);
      logger.success('USECASE: DeletePartyUseCase completado', { id });
    } catch (error) {
      logger.error('USECASE: Error en DeletePartyUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
