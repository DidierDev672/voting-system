/**
 * Adaptador de Repositorio de Partido Político usando Django REST API
 * Implementa el puerto IPartyRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IPartyRepository
 * - Open/Closed: abierto para extensión
 */

import axios from 'axios';

import { djangoApi } from '../../infrastructure/api/django-client';
import { IPartyRepository } from '../../domain/ports/party-repository.port';
import { PoliticalParty, CreatePartyDTO } from '../../domain/types/party';
import { logger } from '../logger/logger';

interface DjangoPartyResponse {
  id: string;
  name: string;
  acronym: string;
  party_type: string;
  ideology: string;
  legal_representative: string;
  representative_id: string;
  email?: string;
  foundation_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreatePartyApiResponse {
  message: string;
  data?: DjangoPartyResponse;
  error?: string;
}

interface ListPartiesApiResponse {
  message: string;
  data?: DjangoPartyResponse[];
}

export class DjangoPartyRepository implements IPartyRepository {
  private readonly endpoint = '/api/political-parties';

  async create(party: CreatePartyDTO): Promise<PoliticalParty> {
    logger.info('DJANGO_PARTY_REPO: Creando partido político', { name: party.name });

    const partyData: Record<string, unknown> = {
      name: party.name,
      acronym: party.acronym,
      party_type: party.partyType,
      ideology: party.ideology,
      legal_representative: party.legalRepresentative,
      representative_id: party.representativeId,
    };

    if (party.email) {
      partyData.email = party.email;
    }
    if (party.foundationDate) {
      partyData.foundation_date = party.foundationDate;
    }
    if (party.isActive !== undefined) {
      partyData.is_active = party.isActive;
    }

    try {
      const response = await djangoApi.post<CreatePartyApiResponse>(
        `${this.endpoint}/register/`,
        partyData
      );

      if (response.data.error) {
        logger.error('DJANGO_PARTY_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      if (!response.data.data) {
        logger.error('DJANGO_PARTY_REPO: No se recibieron datos');
        throw new Error('Error al crear el partido político');
      }

      logger.success('DJANGO_PARTY_REPO: Partido creado exitosamente', {
        id: response.data.data.id,
      });

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PARTY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PARTY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAll(): Promise<PoliticalParty[]> {
    logger.info('DJANGO_PARTY_REPO: Obteniendo todos los partidos');

    try {
      const response = await djangoApi.get<ListPartiesApiResponse>(this.endpoint);

      logger.info('DJANGO_PARTY_REPO: Respuesta cruda', { 
        data: response.data,
        rawData: JSON.stringify(response.data) 
      });

      if (!response.data.data) {
        logger.warning('DJANGO_PARTY_REPO: No se recibieron datos');
        return [];
      }

      logger.success('DJANGO_PARTY_REPO: Partidos obtenidos', {
        count: response.data.data.length,
        firstParty: response.data.data[0],
      });

      return response.data.data.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PARTY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PARTY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getById(id: string): Promise<PoliticalParty | null> {
    logger.info('DJANGO_PARTY_REPO: Obteniendo partido por ID', { id });

    try {
      const response = await djangoApi.get<DjangoPartyResponse>(
        `${this.endpoint}/${id}/`
      );

      return this.mapToEntity(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          logger.warning('DJANGO_PARTY_REPO: Partido no encontrado', { id });
          return null;
        }
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PARTY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PARTY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async update(id: string, party: Partial<CreatePartyDTO>): Promise<PoliticalParty> {
    logger.info('DJANGO_PARTY_REPO: Actualizando partido', { id });

    const updateData: Record<string, unknown> = {};

    if (party.name) updateData.name = party.name;
    if (party.acronym) updateData.acronym = party.acronym;
    if (party.partyType) updateData.party_type = party.partyType;
    if (party.ideology) updateData.ideology = party.ideology;
    if (party.legalRepresentative) updateData.legal_representative = party.legalRepresentative;
    if (party.representativeId) updateData.representative_id = party.representativeId;

    try {
      const response = await djangoApi.patch<DjangoPartyResponse>(
        `${this.endpoint}/${id}/`,
        updateData
      );

      logger.success('DJANGO_PARTY_REPO: Partido actualizado', { id });

      return this.mapToEntity(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PARTY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PARTY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    logger.info('DJANGO_PARTY_REPO: Eliminando partido', { id });

    try {
      await djangoApi.delete(`${this.endpoint}/${id}/`);

      logger.success('DJANGO_PARTY_REPO: Partido eliminado', { id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_PARTY_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_PARTY_REPO: Error desconocido', { error });
      throw error;
    }
  }

  private mapToEntity(data: DjangoPartyResponse): PoliticalParty {
    return {
      id: data.id,
      name: data.name,
      acronym: data.acronym,
      partyType: data.party_type as PoliticalParty['partyType'],
      ideology: data.ideology || '',
      legalRepresentative: data.legal_representative,
      representativeId: data.representative_id,
      email: data.email,
      foundationDate: data.foundation_date,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
