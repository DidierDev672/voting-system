/**
 * Casos de Uso - Alcaldia
 * Application Layer
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de alcaldia
 * - Dependency Inversion: depende de IAlcaldiaRepository
 */

import { IAlcaldiaRepository } from '../../domain/ports/alcaldia-repository.port';
import { Alcaldia, CreateAlcaldiaDTO } from '../../domain/types/alcaldia';

export class CreateAlcaldiaUseCase {
  constructor(private readonly repository: IAlcaldiaRepository) {}

  async execute(data: CreateAlcaldiaDTO): Promise<Alcaldia> {
    if (!data.nombre_entidad || data.nombre_entidad.trim().length < 3) {
      throw new Error('El nombre de la entidad debe tener al menos 3 caracteres');
    }

    if (!data.nit || !this.validateNIT(data.nit)) {
      throw new Error('El NIT es inválido (formato: XX-XXXXXXX-X)');
    }

    if (!data.codigo_sigep || data.codigo_sigep.trim().length < 1) {
      throw new Error('El código SIGEP es requerido');
    }

    if (!data.orden_entidad || !['Municipal', 'Distrital'].includes(data.orden_entidad)) {
      throw new Error('La orden de entidad debe ser Municipal o Distrital');
    }

    if (!data.municipio || data.municipio.trim().length < 2) {
      throw new Error('El municipio es requerido');
    }

    if (!data.direccion_fisica || data.direccion_fisica.trim().length < 5) {
      throw new Error('La dirección física es requerida');
    }

    if (!data.dominio || data.dominio.trim().length < 3) {
      throw new Error('El dominio es requerido');
    }

    if (!data.correo_institucional || !this.validateEmail(data.correo_institucional)) {
      throw new Error('El correo institucional es inválido');
    }

    if (!data.id_alcalde) {
      throw new Error('El ID del alcalde es requerido');
    }

    if (!data.nombre_alcalde || data.nombre_alcalde.trim().length < 3) {
      throw new Error('El nombre del alcalde es requerido');
    }

    if (!data.acto_posesion || data.acto_posesion.trim().length < 1) {
      throw new Error('El acto de posesión es requerido');
    }

    return this.repository.create(data);
  }

  private validateNIT(nit: string): boolean {
    const pattern = /^\d{2}-\d{7,8}-\d$/;
    return pattern.test(nit);
  }

  private validateEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  }
}

export class GetAllAlcaldiasUseCase {
  constructor(private readonly repository: IAlcaldiaRepository) {}

  async execute(): Promise<Alcaldia[]> {
    return this.repository.getAll();
  }
}

export class GetAlcaldiaByIdUseCase {
  constructor(private readonly repository: IAlcaldiaRepository) {}

  async execute(id: string): Promise<Alcaldia> {
    if (!id) {
      throw new Error('El ID de la alcaldía es requerido');
    }

    const alcaldia = await this.repository.getById(id);

    if (!alcaldia) {
      throw new Error('Alcaldía no encontrada');
    }

    return alcaldia;
  }
}

export class UpdateAlcaldiaUseCase {
  constructor(private readonly repository: IAlcaldiaRepository) {}

  async execute(id: string, data: Partial<CreateAlcaldiaDTO>): Promise<Alcaldia> {
    if (!id) {
      throw new Error('El ID de la alcaldía es requerido');
    }

    if (data.nit && !/^\d{2}-\d{7,8}-\d$/.test(data.nit)) {
      throw new Error('El NIT es inválido (formato: XX-XXXXXXX-X)');
    }

    if (data.orden_entidad && !['Municipal', 'Distrital'].includes(data.orden_entidad)) {
      throw new Error('La orden de entidad debe ser Municipal o Distrital');
    }

    if (data.correo_institucional && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.correo_institucional)) {
      throw new Error('El correo institucional es inválido');
    }

    return this.repository.update(id, data);
  }
}

export class DeleteAlcaldiaUseCase {
  constructor(private readonly repository: IAlcaldiaRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('El ID de la alcaldía es requerido');
    }

    await this.repository.delete(id);
  }
}
