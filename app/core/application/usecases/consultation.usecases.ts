/**
 * Caso de Uso: Obtener Todas las Consultas
 * Principios SOLID:
 * - Single Responsibility: una sola razón para cambiar (lógica de obtener consultas)
 * - Dependency Inversion: depende de la abstracción IConsultationRepository
 */

import { IConsultationRepository } from '../../domain/ports/consultation-repository.port';
import { PopularConsultation } from '../../domain/types';

export class GetAllConsultationsUseCase {
  constructor(private readonly repository: IConsultationRepository) {}

  async execute(): Promise<PopularConsultation[]> {
    return this.repository.findAll();
  }
}

/**
 * Caso de Uso: Obtener Consulta por ID
 */

export class GetConsultationByIdUseCase {
  constructor(private readonly repository: IConsultationRepository) {}

  async execute(id: string): Promise<PopularConsultation | null> {
    if (!id) {
      throw new Error('El ID de la consulta es requerido');
    }
    return this.repository.findById(id);
  }
}

/**
 * Caso de Uso: Crear Consulta
 */

export class CreateConsultationUseCase {
  constructor(private readonly repository: IConsultationRepository) {}

  async execute(data: {
    title: string;
    description: string;
    questions: any[];
    proprietaryRepresentation: string;
  }): Promise<PopularConsultation> {
    // Validaciones de negocio
    if (!data.title || data.title.trim().length < 5) {
      throw new Error('El título debe tener al menos 5 caracteres');
    }

    if (!data.description || data.description.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    if (!data.questions || data.questions.length === 0) {
      throw new Error('La consulta debe tener al menos una pregunta');
    }

    if (!data.proprietaryRepresentation) {
      throw new Error('La representación propietaria es requerida');
    }

    return this.repository.create(data);
  }
}

/**
 * Caso de Uso: Publicar Consulta
 */

export class PublishConsultationUseCase {
  constructor(private readonly repository: IConsultationRepository) {}

  async execute(id: string): Promise<PopularConsultation> {
    const consultation = await this.repository.findById(id);

    if (!consultation) {
      throw new Error('Consulta no encontrada');
    }

    if (consultation.status !== 'draft') {
      throw new Error('Solo las consultas en borrador pueden ser publicadas');
    }

    return this.repository.update(id, { status: 'published' });
  }
}

/**
 * Caso de Uso: Cerrar Consulta
 */

export class CloseConsultationUseCase {
  constructor(private readonly repository: IConsultationRepository) {}

  async execute(id: string): Promise<PopularConsultation> {
    const consultation = await this.repository.findById(id);

    if (!consultation) {
      throw new Error('Consulta no encontrada');
    }

    if (consultation.status !== 'published') {
      throw new Error('Solo las consultas publicadas pueden ser cerradas');
    }

    return this.repository.update(id, { status: 'closed' });
  }
}
