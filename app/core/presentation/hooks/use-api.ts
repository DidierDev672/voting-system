/**
 * Ejemplo de uso del API Client en un componente React
 * Hook personalizado para obtener consultas
 */

'use client';

import { useState, useEffect } from 'react';
import { consultationsApi, votesApi } from '@/app/core/application/api-client';
import { PopularConsultation, Vote, CreateConsultationDTO, CreateVoteDTO } from '@/app/core/domain/types';

// Hook para obtener todas las consultas
export function useConsultations() {
  const [consultations, setConsultations] = useState<PopularConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    consultationsApi.getAll()
      .then(setConsultations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { consultations, loading, error };
}

// Hook para crear una consulta
export function useCreateConsultation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateConsultationDTO) => {
    setLoading(true);
    setError(null);
    try {
      return await consultationsApi.create(data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

// Hook para obtener votos de una consulta
export function useVotesByConsultation(idConsult: string) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idConsult) return;
    
    votesApi.getByConsultation(idConsult)
      .then(setVotes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [idConsult]);

  return { votes, loading, error };
}

// Hook para registrar un voto
export function useVote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vote = async (data: CreateVoteDTO) => {
    setLoading(true);
    setError(null);
    try {
      return await votesApi.create(data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { vote, loading, error };
}
