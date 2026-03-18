import { Bancada, CreateBancadaDTO } from "../types/bancada";

export interface BancadaRepositoryPort {
  getAll(): Promise<Bancada[]>;
  getById(id: string): Promise<Bancada | null>;
  getByMiembro(idMiembro: string): Promise<Bancada[]>;
  getByPartido(idPartido: string): Promise<Bancada[]>;
  create(data: CreateBancadaDTO): Promise<Bancada>;
  update(id: string, data: Partial<CreateBancadaDTO>): Promise<Bancada>;
  delete(id: string): Promise<boolean>;
}
