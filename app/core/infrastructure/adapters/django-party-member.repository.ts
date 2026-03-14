/**
 * Adaptador de Repositorio de Miembro de Partido Político usando Django REST API
 * Implementa el puerto IPartyMemberRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IPartyMemberRepository
 * - Open/Closed: abierto para extensión
 */

import axios from 'axios';
import { djangoApi } from '../../infrastructure/api/django-client';
import { IPartyMemberRepository } from '../../domain/ports/party-member-repository.port';
import { PartyMember, CreatePartyMemberDTO } from '../../domain/types/party-member';
import { logger } from '../logger/logger';

interface DjangoMemberResponse {
  id: string;
  full_name: string;
  document_type: string;
  document_number: string;
  birth_date: string;
  city: string;
  political_party_id: string;
  consent: boolean;
  data_authorization: boolean;
  affiliation_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateMemberApiResponse {
  message: string;
  data?: DjangoMemberResponse;
  error?: string;
}

interface ListMembersApiResponse {
  message: string;
  data?: DjangoMemberResponse[];
}

export class DjangoPartyMemberRepository implements IPartyMemberRepository {
  private readonly endpoint = '/api/party-members';

  async create(member: CreatePartyMemberDTO): Promise<PartyMember> {
    logger.info('DJANGO_MEMBER_REPO: Creando miembro de partido', { fullName: member.fullName });

    const memberData = {
      full_name: member.fullName,
      document_type: member.documentType,
      document_number: member.documentNumber,
      birth_date: member.birthDate,
      city: member.city,
      political_party_id: member.politicalPartyId,
      consent: member.consent,
      data_authorization: member.dataAuthorization,
      affiliation_date: member.affiliationDate,
    };

    try {
      const response = await djangoApi.post<CreateMemberApiResponse>(
        `${this.endpoint}/register/`,
        memberData
      );

      if (response.data.error) {
        logger.error('DJANGO_MEMBER_REPO: Error de la API', { error: response.data.error });
        throw new Error(response.data.error);
      }

      if (!response.data.data) {
        logger.error('DJANGO_MEMBER_REPO: No se recibieron datos');
        throw new Error('Error al crear el miembro del partido');
      }

      logger.success('DJANGO_MEMBER_REPO: Miembro creado exitosamente', {
        id: response.data.data.id,
      });

      return this.mapToEntity(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_MEMBER_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_MEMBER_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getAll(): Promise<PartyMember[]> {
    logger.info('DJANGO_MEMBER_REPO: Obteniendo todos los miembros');

    try {
      const response = await djangoApi.get<ListMembersApiResponse>(this.endpoint);

      if (!response.data.data) {
        logger.warning('DJANGO_MEMBER_REPO: No se recibieron datos');
        return [];
      }

      logger.success('DJANGO_MEMBER_REPO: Miembros obtenidos', {
        count: response.data.data.length,
      });

      return response.data.data.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_MEMBER_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_MEMBER_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getById(id: string): Promise<PartyMember | null> {
    logger.info('DJANGO_MEMBER_REPO: Obteniendo miembro por ID', { id });

    try {
      const response = await djangoApi.get<DjangoMemberResponse>(
        `${this.endpoint}/${id}/`
      );

      return this.mapToEntity(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          logger.warning('DJANGO_MEMBER_REPO: Miembro no encontrado', { id });
          return null;
        }
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_MEMBER_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_MEMBER_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getByPartyId(partyId: string): Promise<PartyMember[]> {
    logger.info('DJANGO_MEMBER_REPO: Obteniendo miembros por partido', { partyId });

    try {
      const response = await djangoApi.get<ListMembersApiResponse>(
        `${this.endpoint}/?party_id=${partyId}`
      );

      if (!response.data.data) {
        return [];
      }

      return response.data.data.map(this.mapToEntity);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_MEMBER_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_MEMBER_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async getByDocumentNumber(documentNumber: string): Promise<PartyMember | null> {
    logger.info('DJANGO_MEMBER_REPO: Buscando miembro por documento', { documentNumber });

    try {
      const response = await djangoApi.get<ListMembersApiResponse>(
        `${this.endpoint}/?document_number=${documentNumber}`
      );

      if (!response.data.data || response.data.data.length === 0) {
        logger.warning('DJANGO_MEMBER_REPO: Miembro no encontrado', { documentNumber });
        return null;
      }

      logger.success('DJANGO_MEMBER_REPO: Miembro encontrado', { 
        documentNumber, 
        memberId: response.data.data[0].id 
      });

      return this.mapToEntity(response.data.data[0]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_MEMBER_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_MEMBER_REPO: Error desconocido', { error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    logger.info('DJANGO_MEMBER_REPO: Eliminando miembro', { id });

    try {
      await djangoApi.delete(`${this.endpoint}/${id}/`);

      logger.success('DJANGO_MEMBER_REPO: Miembro eliminado', { id });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        logger.error('DJANGO_MEMBER_REPO: Error de Axios', { message });
        throw new Error(message);
      }
      logger.error('DJANGO_MEMBER_REPO: Error desconocido', { error });
      throw error;
    }
  }

  private mapToEntity(data: DjangoMemberResponse): PartyMember {
    return {
      id: data.id,
      fullName: data.full_name,
      documentType: data.document_type as PartyMember['documentType'],
      documentNumber: data.document_number,
      birthDate: data.birth_date,
      city: data.city,
      politicalPartyId: data.political_party_id,
      consent: data.consent,
      dataAuthorization: data.data_authorization,
      affiliationDate: data.affiliation_date,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
