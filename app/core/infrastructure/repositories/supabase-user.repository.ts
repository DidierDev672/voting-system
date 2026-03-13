/**
 * Adaptador de Usuario usando Supabase
 * Implementa el puerto IUserRepository
 * Principios SOLID:
 * - Liskov Substitution: puede替换 cualquier implementación de IUserRepository
 * - Open/Closed: abierto para extensión, cerrado para modificación
 */

import { supabase } from '../../infrastructure/supabase/client';
import { IUserRepository } from '../../domain/ports/user-repository.port';
import { User, CreateUserDTO, UpdateUserDTO } from '../../domain/types';

export class SupabaseUserRepository implements IUserRepository {
  private readonly table = 'users';

  private mapToEntity(data: any): User {
    return {
      id: data.id,
      authId: data.auth_id,
      fullName: data.full_name,
      documentType: data.document_type,
      documentNumber: data.document_number,
      email: data.email,
      phone: data.phone,
      role: data.role,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async create(data: CreateUserDTO): Promise<User> {
    const { data: result, error } = await supabase
      .from(this.table)
      .insert({
        full_name: data.fullName,
        document_type: data.documentType,
        document_number: data.documentNumber,
        email: data.email,
        phone: data.phone,
        role: data.role || 'CITIZEN',
        is_active: true,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToEntity(result);
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findByAuthId(authId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) return null;
    return this.mapToEntity(data);
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToEntity);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const updateData: any = {};
    if (data.fullName) updateData.full_name = data.fullName;
    if (data.documentType) updateData.document_type = data.documentType;
    if (data.documentNumber) updateData.document_number = data.documentNumber;
    if (data.phone) updateData.phone = data.phone;

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
    const { error } = await supabase
      .from(this.table)
      .update({ is_active: false })
      .eq('id', id);

    return !error;
  }
}
