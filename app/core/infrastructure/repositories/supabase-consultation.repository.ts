/**
 * Adaptador de Consulta Popular usando Supabase
 * Implementa el puerto IConsultationRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IConsultationRepository
 * - Open/Closed: abierto para extensión, cerrado para modificación
 */

import { supabase } from '../../infrastructure/supabase/client';
import { IConsultationRepository } from '../../domain/ports/consultation-repository.port';
import {
  PopularConsultation,
  CreateConsultationDTO,
  UpdateConsultationDTO,
  Question,
} from '../../domain/types';

export class SupabaseConsultationRepository implements IConsultationRepository {
  private readonly table = 'popular_consultations';

  private mapToEntity(data: any): PopularConsultation {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      questions: data.questions as Question[],
      proprietaryRepresentation: data.proprietary_representation,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async create(data: CreateConsultationDTO): Promise<PopularConsultation> {
    const { data: result, error } = await supabase
      .from(this.table)
      .insert({
        title: data.title,
        description: data.description,
        questions: data.questions,
        proprietary_representation: data.proprietaryRepresentation,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<PopularConsultation | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findAll(): Promise<PopularConsultation[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToEntity);
  }

  async findByStatus(status: string): Promise<PopularConsultation[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToEntity);
  }

  async update(
    id: string,
    data: UpdateConsultationDTO,
  ): Promise<PopularConsultation> {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.questions) updateData.questions = data.questions;
    if (data.proprietaryRepresentation)
      updateData.proprietary_representation = data.proprietaryRepresentation;
    if (data.status) updateData.status = data.status;

    const { data: result, error } = await supabase
      .from(this.table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from(this.table).delete().eq('id', id);

    return !error;
  }
}
