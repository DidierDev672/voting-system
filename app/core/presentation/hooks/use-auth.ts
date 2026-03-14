/**
 * Hook de Autenticación
 * Proporciona estado y funciones de autenticación
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseAuthAdapter } from '@/app/core/infrastructure/adapters/supabase-auth.adapter';
import { LoginUseCase } from '@/app/core/application/usecases/auth.usecases';
import { AuthUser, AuthSession, LoginDTO } from '@/app/core/domain/types/auth';

const authAdapter = new SupabaseAuthAdapter();
const loginUseCase = new LoginUseCase(authAdapter);

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Solo acceder a localStorage después de montaje
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar sesión al cargar (solo en cliente)
  useEffect(() => {
    if (!mounted) return;

    const storedSession = localStorage.getItem('auth_session');
    const storedUser = localStorage.getItem('auth_user');

    if (storedSession && storedUser) {
      try {
        setSession(JSON.parse(storedSession));
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('auth_session');
        localStorage.removeItem('auth_user');
      }
    }

    setLoading(false);
  }, [mounted]);

  // Iniciar sesión
  const login = useCallback(
    async (credentials: LoginDTO) => {
      setLoading(true);
      try {
        const result = await loginUseCase.execute(credentials);

        localStorage.setItem('auth_session', JSON.stringify(result.session));
        localStorage.setItem('auth_user', JSON.stringify(result.user));

        setUser(result.user);
        setSession(result.session);

        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  // Cerrar sesión
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (session?.accessToken) {
        await authAdapter.logout(session.accessToken);
      }
    } finally {
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_user');
      setUser(null);
      setSession(null);
      router.push('/login');
      setLoading(false);
    }
  }, [session, router]);

  // Verificar si está autenticado (solo después de montado)
  const isAuthenticated = mounted && !!session && !!user;

  return {
    user,
    session,
    loading: loading || !mounted,
    isAuthenticated,
    login,
    logout,
  };
}
