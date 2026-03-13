/**
 * Adaptador de Autenticación usando Supabase
 * Implementa el puerto IAuthPort
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IAuthPort
 * - Open/Closed: abierto para extensión
 */

import { supabase } from '../../infrastructure/supabase/client';
import { IAuthPort } from '../../domain/ports/auth.port';
import { AuthUser, AuthSession, LoginDTO, AuthResponse } from '../../domain/types/auth';

export class SupabaseAuthAdapter implements IAuthPort {
  async login(credentials: LoginDTO): Promise<{ user: AuthUser; session: AuthSession }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Error al iniciar sesión');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        fullName: data.user.user_metadata?.full_name || '',
        phone: data.user.user_metadata?.phone,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name || '',
        },
      },
    };
  }

  async logout(accessToken: string): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(accessToken: string): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      fullName: data.user.user_metadata?.full_name || '',
      phone: data.user.user_metadata?.phone,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthSession> {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      throw new Error('Error al refrescar sesión');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        fullName: data.user.user_metadata?.full_name || '',
      },
    };
  }
}
