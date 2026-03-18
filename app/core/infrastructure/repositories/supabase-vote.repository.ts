/**
 * Adaptador de Votos usando Supabase
 * Implementa el puerto IVoteRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IVoteRepository
 * - Open/Closed: abierto para extensión, cerrado para modificación
 */

import { supabase } from '../../infrastructure/supabase/client';
import { IVoteRepository } from '../../domain/ports/vote-repository.port';
import { Vote, CreateVoteDTO } from '../../domain/types';

export class SupabaseVoteRepository implements IVoteRepository {
  private readonly table = 'votes_consult';

  private mapToEntity(data: any): Vote {
    return {
      id: data.id,
      idConsult: data.id_consult,
      idMember: data.id_member,
      idParty: data.id_party,
      idAuth: data.id_auth,
      valueVote: data.value_vote,
      comment: data.comment,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async create(data: CreateVoteDTO): Promise<Vote> {
    const { data: result, error } = await supabase
      .from(this.table)
      .insert({
        id_consult: data.idConsult,
        id_member: data.idMember,
        id_party: data.idParty,
        id_auth: data.idAuth,
        value_vote: data.valueVote,
        comment: data.comment,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<Vote | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findByConsultation(idConsult: string): Promise<Vote[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id_consult', idConsult)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToEntity);
  }

  async findByMember(idMember: string): Promise<Vote[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id_member', idMember)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToEntity);
  }

  async existsByMemberAndConsult(
    idMember: string,
    idConsult: string,
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.table)
      .select('id')
      .eq('id_member', idMember)
      .eq('id_consult', idConsult)
      .single();

    return !error && !!data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);

    return !error;
  }

  async getAll(): Promise<Vote[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToEntity);
  }

  async getByConsultation(consultationId: string): Promise<Vote[]> {
    return this.findByConsultation(consultationId);
  }

  async getByMember(documentNumber: string): Promise<Vote[]> {
    return this.findByMember(documentNumber);
  }
}
