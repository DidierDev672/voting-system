import { Bancada, CreateBancadaDTO } from "../../domain/types/bancada";
import { BancadaRepositoryPort } from "../../domain/ports/bancada-repository.port";

export class GetAllBancadasUseCase {
  constructor(private repository: BancadaRepositoryPort) {}

  async execute(): Promise<Bancada[]> {
    return this.repository.getAll();
  }
}

export class GetBancadaByIdUseCase {
  constructor(private repository: BancadaRepositoryPort) {}

  async execute(id: string): Promise<Bancada | null> {
    if (!id) throw new Error("El ID es requerido");
    return this.repository.getById(id);
  }
}

export class GetBancadasByMiembroUseCase {
  constructor(private repository: BancadaRepositoryPort) {}

  async execute(idMiembro: string): Promise<Bancada[]> {
    if (!idMiembro) throw new Error("El ID del miembro es requerido");
    return this.repository.getByMiembro(idMiembro);
  }
}

export class GetBancadasByPartidoUseCase {
  constructor(private repository: BancadaRepositoryPort) {}

  async execute(idPartido: string): Promise<Bancada[]> {
    if (!idPartido) throw new Error("El ID del partido es requerido");
    return this.repository.getByPartido(idPartido);
  }
}

export class CreateBancadaUseCase {
  constructor(private repository: BancadaRepositoryPort) {}

  async execute(data: CreateBancadaDTO): Promise<Bancada> {
    this.validate(data);
    return this.repository.create(data);
  }

  private validate(data: CreateBancadaDTO): void {
    if (!data.id_miembro) throw new Error("El miembro es requerido");
    if (!data.id_partido) throw new Error("El partido es requerido");
    if (!data.tipo_curul) throw new Error("El tipo de curul es requerido");
    if (!data.fin_periodo) throw new Error("La fecha de fin de período es requerida");
    if (!data.comision_permanente) throw new Error("La comisión permanente es requerida");
    if (!data.correo_institucional) throw new Error("El correo institucional es requerido");
    if (!data.profesion) throw new Error("La profesión es requerida");
  }
}

export class UpdateBancadaUseCase {
  constructor(private repository: BancadaRepositoryPort) {}

  async execute(id: string, data: Partial<CreateBancadaDTO>): Promise<Bancada> {
    if (!id) throw new Error("El ID es requerido");
    return this.repository.update(id, data);
  }
}

export class DeleteBancadaUseCase {
  constructor(private repository: BancadaRepositoryPort) {}

  async execute(id: string): Promise<boolean> {
    if (!id) throw new Error("El ID es requerido");
    return this.repository.delete(id);
  }
}
