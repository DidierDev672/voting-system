/**
 * Adaptador de Repositorio de Partido Político usando Supabase
 * Implementa el puerto IPartyRepository
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IPartyRepository
 * - Open/Closed: abierto para extensión
 */

import { supabase } from '../../infrastructure/supabase/client';
import { IPartyRepository } from '../../domain/ports/party-repository.port';
import { PoliticalParty, CreatePartyDTO } from '../../domain/types/party';
import { logger } from '../logger/logger';

export class SupabasePartyRepository implements IPartyRepository {
  private readonly tableName = 'political_parties';

  async create(party: CreatePartyDTO): Promise<PoliticalParty> {
    logger.info('PARTY_REPO: Creando partido político', { name: party.name });

    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        name: party.name,
        acronym: party.acronym,
        party_type: party.partyType,
        ideology: party.ideology,
        legal_representative: party.legalRepresentative,
        representative_id: party.representativeId,
      })
      .select()
      .single();

    if (error) {
      logger.error('PARTY_REPO: Error al crear partido', { error: error.message });
      throw new Error(error.message);
    }

    logger.success('PARTY_REPO: Partido creado exitosamente', { id: data.id });
    
    return this.mapToEntity(data);
  }

  async getAll(): Promise<PoliticalParty[]> {
    logger.info('PARTY_REPO: Obteniendo todos los partidos');

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('PARTY_REPO: Error al obtener partidos', { error: error.message });
      throw new Error(error.message);
    }

    logger.success('PARTY_REPO: Partidos obtenidos', { count: data?.length });
    
    return (data || []).map(this.mapToEntity);
  }

  async getById(id: string): Promise<PoliticalParty | null> {
    logger.info('PARTY_REPO: Obteniendo partido por ID', { id });

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.warning('PARTY_REPO: Partido no encontrado', { id });
        return null;
      }
      logger.error('PARTY_REPO: Error al obtener partido', { error: error.message });
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async update(id: string, party: Partial<CreatePartyDTO>): Promise<PoliticalParty> {
    logger.info('PARTY_REPO: Actualizando partido', { id });

    const updateData: Record<string, unknown> = {};
    
    if (party.name) updateData.name = party.name;
    if (party.acronym) updateData.acronym = party.acronym;
    if (party.partyType) updateData.party_type = party.partyType;
    if (party.ideology) updateData.ideology = party.ideology;
    if (party.legalRepresentative) updateData.legal_representative = party.legalRepresentative;
    if (party.representativeId) updateData.representative_id = party.representativeId;
    
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('PARTY_REPO: Error al actualizar partido', { error: error.message });
      throw new Error(error.message);
    }

    logger.success('PARTY_REPO: Partido actualizado', { id });
    
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    logger.info('PARTY_REPO: Eliminando partido', { id });

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('PARTY_REPO: Error al eliminar partido', { error: error.message });
      throw new Error(error.message);
    }

    logger.success('PARTY_REPO: Partido eliminado', { id });
  }

  private mapToEntity(data: Record<string, unknown>): PoliticalParty {
    return {
      id: data.id as string,
      name: data.name as string,
      acronym: data.acronym as string,
      partyType: data.party_type as PoliticalParty['partyType'],
      ideology: data.ideology as string,
      legalRepresentative: data.legal_representative as string,
      representativeId: data.representative_id as string,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}
