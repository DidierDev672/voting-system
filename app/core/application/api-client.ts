/**
 * Cliente API para el Frontend
 * Proporciona una abstracción sobre las llamadas HTTP
 * Principios SOLID:
 * - Single Responsibility: manejar todas las llamadas API
 * - Interface Segregation: métodos específicos para cada recurso
 */

import {
  PopularConsultation,
  CreateConsultationDTO,
  Vote,
  CreateVoteDTO,
} from '../domain/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Error desconocido' }));
    throw new ApiError(response.status, error.error || 'Error en la solicitud');
  }
  return response.json();
}

// ============================================
// SERVICIO DE CONSULTAS
// ============================================

export const consultationsApi = {
  async getAll(): Promise<PopularConsultation[]> {
    const response = await fetch(`${API_BASE_URL}/api/consultations`);
    const result = await handleResponse<{
      success: boolean;
      data: PopularConsultation[];
    }>(response);
    return result.data;
  },

  async getById(id: string): Promise<PopularConsultation | null> {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${id}`);
    const result = await handleResponse<{
      success: boolean;
      data: PopularConsultation | null;
    }>(response);
    return result.data;
  },

  async create(data: CreateConsultationDTO): Promise<PopularConsultation> {
    const response = await fetch(`${API_BASE_URL}/api/consultations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await handleResponse<{
      success: boolean;
      data: PopularConsultation;
    }>(response);
    return result.data;
  },

  async publish(id: string): Promise<PopularConsultation> {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish' }),
    });
    const result = await handleResponse<{
      success: boolean;
      data: PopularConsultation;
    }>(response);
    return result.data;
  },

  async close(id: string): Promise<PopularConsultation> {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'close' }),
    });
    const result = await handleResponse<{
      success: boolean;
      data: PopularConsultation;
    }>(response);
    return result.data;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/consultations/${id}`, {
      method: 'DELETE',
    });
    await handleResponse<{ success: boolean }>(response);
  },
};

// ============================================
// SERVICIO DE VOTOS
// ============================================

export const votesApi = {
  async getByConsultation(idConsult: string): Promise<Vote[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/votes?idConsult=${idConsult}`,
    );
    const result = await handleResponse<{ success: boolean; data: Vote[] }>(
      response,
    );
    return result.data;
  },

  async getByMember(idMember: string): Promise<Vote[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/votes?idMember=${idMember}`,
    );
    const result = await handleResponse<{ success: boolean; data: Vote[] }>(
      response,
    );
    return result.data;
  },

  async create(data: CreateVoteDTO): Promise<Vote> {
    const response = await fetch(`${API_BASE_URL}/api/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await handleResponse<{ success: boolean; data: Vote }>(
      response,
    );
    return result.data;
  },
};
