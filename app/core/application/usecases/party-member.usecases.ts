/**
 * Casos de Uso de Miembro de Partido Político
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de miembro de partido
 * - Dependency Inversion: depende de IPartyMemberRepository
 */

import { IPartyMemberRepository } from '../../domain/ports/party-member-repository.port';
import { PartyMember, CreatePartyMemberDTO } from '../../domain/types/party-member';
import { logger } from '../../infrastructure/logger/logger';

export class CreatePartyMemberUseCase {
  constructor(private readonly memberRepository: IPartyMemberRepository) {}

  async execute(member: CreatePartyMemberDTO): Promise<PartyMember> {
    logger.info('USECASE: Iniciando CreatePartyMemberUseCase', { fullName: member.fullName });

    if (!member.fullName || member.fullName.trim().length === 0) {
      logger.warning('USECASE: Nombre completo inválido');
      throw new Error('El nombre completo es requerido');
    }

    if (!member.documentType) {
      logger.warning('USECASE: Tipo de documento no seleccionado');
      throw new Error('El tipo de documento es requerido');
    }

    if (!member.documentNumber || member.documentNumber.trim().length === 0) {
      logger.warning('USECASE: Número de documento no proporcionado');
      throw new Error('El número de documento es requerido');
    }

    if (!member.birthDate) {
      logger.warning('USECASE: Fecha de nacimiento no proporcionada');
      throw new Error('La fecha de nacimiento es requerida');
    }

    if (!member.city || member.city.trim().length === 0) {
      logger.warning('USECASE: Ciudad no proporcionada');
      throw new Error('La ciudad es requerida');
    }

    if (!member.politicalPartyId) {
      logger.warning('USECASE: Partido político no seleccionado');
      throw new Error('El partido político es requerido');
    }

    if (!member.consent) {
      logger.warning('USECASE: Consentimiento no aceptado');
      throw new Error('Debe aceptar la afiliación política');
    }

    if (!member.dataAuthorization) {
      logger.warning('USECASE: Autorización de datos no aceptada');
      throw new Error('Debe autorizar el tratamiento de datos');
    }

    if (!member.affiliationDate) {
      logger.warning('USECASE: Fecha de afiliación no proporcionada');
      throw new Error('La fecha de afiliación es requerida');
    }

    try {
      const result = await this.memberRepository.create(member);
      logger.success('USECASE: CreatePartyMemberUseCase completado', { id: result.id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en CreatePartyMemberUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetAllMembersUseCase {
  constructor(private readonly memberRepository: IPartyMemberRepository) {}

  async execute(): Promise<PartyMember[]> {
    logger.info('USECASE: Iniciando GetAllMembersUseCase');

    try {
      const result = await this.memberRepository.getAll();
      logger.success('USECASE: GetAllMembersUseCase completado', { count: result.length });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetAllMembersUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetMembersByPartyUseCase {
  constructor(private readonly memberRepository: IPartyMemberRepository) {}

  async execute(partyId: string): Promise<PartyMember[]> {
    logger.info('USECASE: Iniciando GetMembersByPartyUseCase', { partyId });

    if (!partyId) {
      logger.warning('USECASE: ID de partido no proporcionado');
      throw new Error('El ID del partido es requerido');
    }

    try {
      const result = await this.memberRepository.getByPartyId(partyId);
      logger.success('USECASE: GetMembersByPartyUseCase completado', { count: result.length });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetMembersByPartyUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class DeletePartyMemberUseCase {
  constructor(private readonly memberRepository: IPartyMemberRepository) {}

  async execute(id: string): Promise<void> {
    logger.info('USECASE: Iniciando DeletePartyMemberUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID de miembro no proporcionado');
      throw new Error('El ID del miembro es requerido');
    }

    try {
      await this.memberRepository.delete(id);
      logger.success('USECASE: DeletePartyMemberUseCase completado', { id });
    } catch (error) {
      logger.error('USECASE: Error en DeletePartyMemberUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
