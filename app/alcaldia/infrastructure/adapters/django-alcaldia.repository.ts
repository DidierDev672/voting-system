/**
 * Repository Adapter - Alcaldia using Django REST API
 * Infrastructure Layer
 * SOLID Principles - Adapter Pattern
 */

import axios from 'axios';
import { alcaldiaApi } from '../api/django-client';
import { IAlcaldiaRepository } from '../../domain/ports/alcaldia-repository.port';
import { Alcaldia, CreateAlcaldiaDTO, UpdateAlcaldiaDTO } from '../../domain/types/alcaldia';

interface DjangoAlcaldiaResponse {
  id: string;
  nombre_entidad: string;
  nit: string;
  codigo_sigep: string;
  orden_entidad: string;
  municipio: string;
  direccion_fisica: string;
  dominio: string;
  correo_institucional: string;
  id_alcalde: string;
  nombre_alcalde: string;
  acto_posesion: string;
  created_at: string;
  updated_at: string;
}

interface CreateAlcaldiaApiResponse {
  success: boolean;
  message?: string;
  data?: DjangoAlcaldiaResponse;
  error?: string;
}

interface ListAlcaldiaApiResponse {
  success: boolean;
  data?: DjangoAlcaldiaResponse[];
  count?: number;
}

interface GetAlcaldiaApiResponse {
  success: boolean;
  data?: DjangoAlcaldiaResponse;
  error?: string;
}

export class DjangoAlcaldiaRepository implements IAlcaldiaRepository {
  private readonly endpoint = '/api/v1/alcaldias/';

  private mapToEntity(data: DjangoAlcaldiaResponse): Alcaldia {
    return {
      id: data.id,
      nombreEntidad: data.nombre_entidad,
      nit: data.nit,
      codigoSigep: data.codigo_sigep,
      ordenEntidad: data.orden_entidad as Alcaldia['ordenEntidad'],
      municipio: data.municipio,
      direccionFisica: data.direccion_fisica,
      dominio: data.dominio,
      correoInstitucional: data.correo_institucional,
      idAlcalde: data.id_alcalde,
      nombreAlcalde: data.nombre_alcalde,
      actoPosesion: data.acto_posesion,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async create(data: CreateAlcaldiaDTO): Promise<Alcaldia> {
    try {
      const response = await alcaldiaApi.post<CreateAlcaldiaApiResponse>(
        this.endpoint,
        data
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (!response.data.data) {
        throw new Error('Error al crear la alcaldía');
      }

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  async getAll(): Promise<Alcaldia[]> {
    try {
      const response = await alcaldiaApi.get<ListAlcaldiaApiResponse>(this.endpoint);

      if (!response.data.data) {
        return [];
      }

      return response.data.data.map(item => this.mapToEntity(item));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  async getById(id: string): Promise<Alcaldia | null> {
    try {
      const response = await alcaldiaApi.get<GetAlcaldiaApiResponse>(
        `${this.endpoint}${id}/`
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (!response.data.data) {
        return null;
      }

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateAlcaldiaDTO): Promise<Alcaldia> {
    try {
      const response = await alcaldiaApi.put<GetAlcaldiaApiResponse>(
        `${this.endpoint}${id}/`,
        data
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (!response.data.data) {
        throw new Error('Error al actualizar la alcaldía');
      }

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await alcaldiaApi.delete(`${this.endpoint}${id}/`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }
}
