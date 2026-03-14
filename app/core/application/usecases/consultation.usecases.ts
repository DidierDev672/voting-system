/**
 * Casos de Uso de Consulta Popular
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de consulta popular
 * - Dependency Inversion: depende de IConsultationRepository
 */

import { IConsultationRepository } from '../../domain/ports/consultation-repository.port';
import { Consultation, CreateConsultationDTO, Question, QuestionType } from '../../domain/types/consultation';
import { logger } from '../../infrastructure/logger/logger';

export class CreateConsultationUseCase {
  constructor(private readonly consultationRepository: IConsultationRepository) {}

  async execute(consultation: CreateConsultationDTO): Promise<Consultation> {
    logger.info('USECASE: Iniciando CreateConsultationUseCase', { title: consultation.title });

    if (!consultation.title || consultation.title.trim().length === 0) {
      logger.warning('USECASE: Título de consulta inválido');
      throw new Error('El título de la consulta es requerido');
    }

    if (!consultation.description || consultation.description.trim().length === 0) {
      logger.warning('USECASE: Descripción de consulta inválida');
      throw new Error('La descripción de la consulta es requerida');
    }

    if (!consultation.questions || consultation.questions.length === 0) {
      logger.warning('USECASE: Sin preguntas en la consulta');
      throw new Error('La consulta debe tener al menos una pregunta');
    }

    for (const question of consultation.questions) {
      this.validateQuestion(question);
    }

    if (!consultation.proprietaryRepresentation || consultation.proprietaryRepresentation.trim().length === 0) {
      logger.warning('USECASE: Representación propietaria no proporcionada');
      throw new Error('La representación propietaria es requerida');
    }

    try {
      const result = await this.consultationRepository.create(consultation);
      logger.success('USECASE: CreateConsultationUseCase completado', { id: result.id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en CreateConsultationUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }

  private validateQuestion(question: Question): void {
    if (!question.text || question.text.trim().length < 3) {
      throw new Error('El texto de la pregunta debe tener al menos 3 caracteres');
    }

    const selectionTypes: QuestionType[] = ['multiple_choice', 'single_choice'];
    if (selectionTypes.includes(question.questionType)) {
      if (!question.options || question.options.length < 2) {
        throw new Error(`La pregunta "${question.text}" debe tener al menos 2 opciones`);
      }
    }
  }
}

export class GetAllConsultationsUseCase {
  constructor(private readonly consultationRepository: IConsultationRepository) {}

  async execute(): Promise<Consultation[]> {
    logger.info('USECASE: Iniciando GetAllConsultationsUseCase');

    try {
      const result = await this.consultationRepository.getAll();
      logger.success('USECASE: GetAllConsultationsUseCase completado', { count: result.length });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetAllConsultationsUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class GetConsultationByIdUseCase {
  constructor(private readonly consultationRepository: IConsultationRepository) {}

  async execute(id: string): Promise<Consultation | null> {
    logger.info('USECASE: Iniciando GetConsultationByIdUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID de consulta no proporcionado');
      throw new Error('El ID de la consulta es requerido');
    }

    try {
      const result = await this.consultationRepository.getById(id);
      logger.success('USECASE: GetConsultationByIdUseCase completado', { id, found: !!result });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en GetConsultationByIdUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class PublishConsultationUseCase {
  constructor(private readonly consultationRepository: IConsultationRepository) {}

  async execute(id: string): Promise<Consultation> {
    logger.info('USECASE: Iniciando PublishConsultationUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID de consulta no proporcionado');
      throw new Error('El ID de la consulta es requerido');
    }

    try {
      const result = await this.consultationRepository.publish(id);
      logger.success('USECASE: PublishConsultationUseCase completado', { id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en PublishConsultationUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class CloseConsultationUseCase {
  constructor(private readonly consultationRepository: IConsultationRepository) {}

  async execute(id: string): Promise<Consultation> {
    logger.info('USECASE: Iniciando CloseConsultationUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID de consulta no proporcionado');
      throw new Error('El ID de la consulta es requerido');
    }

    try {
      const result = await this.consultationRepository.close(id);
      logger.success('USECASE: CloseConsultationUseCase completado', { id });
      return result;
    } catch (error) {
      logger.error('USECASE: Error en CloseConsultationUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

export class DeleteConsultationUseCase {
  constructor(private readonly consultationRepository: IConsultationRepository) {}

  async execute(id: string): Promise<void> {
    logger.info('USECASE: Iniciando DeleteConsultationUseCase', { id });

    if (!id) {
      logger.warning('USECASE: ID de consulta no proporcionado');
      throw new Error('El ID de la consulta es requerido');
    }

    try {
      await this.consultationRepository.delete(id);
      logger.success('USECASE: DeleteConsultationUseCase completado', { id });
    } catch (error) {
      logger.error('USECASE: Error en DeleteConsultationUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
