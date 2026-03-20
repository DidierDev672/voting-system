/**
 * Repository Adapter - Party Members using Django REST API
 */

import axios from 'axios';
import { djangoApi } from '../../../core/infrastructure/api/django-client';

interface PartyMember {
  id: string;
  fullName: string;
  documentNumber: string;
  email: string;
}

interface PartyMembersApiResponse {
  success: boolean;
  data?: {
    id: string;
    full_name: string;
    document_number: string;
    email: string;
  }[];
  error?: string;
}

export class DjangoPartyMembersRepository {
  private readonly endpoint = '/api/party-members/';

  async getAll(): Promise<PartyMember[]> {
    try {
      const response = await djangoApi.get<PartyMembersApiResponse>(this.endpoint);

      if (!response.data.data) {
        return [];
      }

      return response.data.data.map(item => ({
        id: item.id,
        fullName: item.full_name,
        documentNumber: item.document_number,
        email: item.email,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }
}
