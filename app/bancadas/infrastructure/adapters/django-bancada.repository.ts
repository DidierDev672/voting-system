import {
  Bancada,
  CreateBancadaDTO,
  formatTipoCurul,
  formatComision,
} from '../../core/domain/types/bancada';
import { BancadaRepositoryPort } from '../../core/domain/ports/bancada-repository.port';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiBancadaResponse {
  id: string;
  id_miembro: string;
  id_partido: string;
  tipo_curul: string;
  fin_periodo: string;
  declaraciones_bienes: string;
  antecedentes_siri_sirus: string;
  comision_permanente: string;
  correo_institucional: string;
  profesion: string;
  created_at?: string;
  updated_at?: string;
}

export class DjangoBancadaRepository implements BancadaRepositoryPort {
  private baseUrl = `http://127.0.0.1:8000/api/v1/bancadas/`;

  private mapToEntity(data: ApiBancadaResponse): Bancada {
    return {
      id: data.id,
      id_miembro: data.id_miembro,
      id_partido: data.id_partido,
      tipo_curul: formatTipoCurul(data.tipo_curul) as Bancada['tipo_curul'],
      fin_periodo: data.fin_periodo,
      declaraciones_bienes: data.declaraciones_bienes,
      antecedentes_siri_sirus: data.antecedentes_siri_sirus,
      comision_permanente: formatComision(
        data.comision_permanente,
      ) as Bancada['comision_permanente'],
      correo_institucional: data.correo_institucional,
      profesion: data.profesion,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getAll(): Promise<Bancada[]> {
    const data = await this.request<ApiBancadaResponse[]>('');
    return Array.isArray(data)
      ? data.map((item) => this.mapToEntity(item))
      : [];
  }

  async getById(id: string): Promise<Bancada | null> {
    try {
      const data = await this.request<ApiBancadaResponse>(`${id}/`);
      return this.mapToEntity(data);
    } catch {
      return null;
    }
  }

  async getByMiembro(idMiembro: string): Promise<Bancada[]> {
    const data = await this.request<ApiBancadaResponse[]>(
      `miembro/${idMiembro}/`,
    );
    return Array.isArray(data)
      ? data.map((item) => this.mapToEntity(item))
      : [];
  }

  async getByPartido(idPartido: string): Promise<Bancada[]> {
    const data = await this.request<ApiBancadaResponse[]>(
      `partido/${idPartido}/`,
    );
    return Array.isArray(data)
      ? data.map((item) => this.mapToEntity(item))
      : [];
  }

  async create(data: CreateBancadaDTO): Promise<Bancada> {
    return this.request<Bancada>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<CreateBancadaDTO>): Promise<Bancada> {
    return this.request<Bancada>(`${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.request<void>(`${id}/`, { method: 'DELETE' });
    return true;
  }
}

export const bancadaRepository = new DjangoBancadaRepository();
