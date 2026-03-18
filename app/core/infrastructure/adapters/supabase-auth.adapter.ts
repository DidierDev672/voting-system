/**
 * Adaptador de Autenticación usando Supabase
 * Implementa el puerto IAuthPort
 * Principios SOLID:
 * - Liskov Substitution: puede reemplazar cualquier implementación de IAuthPort
 * - Open/Closed: abierto para extensión
 */

import { supabase } from '../../infrastructure/supabase/client';
import { IAuthPort } from '../../domain/ports/auth.port';
import { AuthUser, AuthSession, LoginDTO } from '../../domain/types/auth';
import { logger } from '../logger/logger';

export class SupabaseAuthAdapter implements IAuthPort {
  async login(
    credentials: LoginDTO,
  ): Promise<{ user: AuthUser; session: AuthSession }> {
    logger.info('AUTH: Iniciando proceso de login', {
      email: credentials.email,
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      logger.error('AUTH: Error en login', {
        error: error.message,
        email: credentials.email,
      });
      logger.error('AUTH: Detalles del error en login', error);
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      logger.warning('AUTH: Respuesta inválida de Supabase');
      throw new Error('Error al iniciar sesión');
    }

    logger.success('AUTH: Login exitoso', {
      userId: data.user.id,
      email: data.user.email,
    });

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
        expiresAt: data.session.expires_at ?? 0,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name || '',
        },
      },
    };
  }

  async logout(_accessToken: string): Promise<void> {
    logger.info('AUTH: Iniciando proceso de logout');

    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error('AUTH: Error en logout', { error: error.message });
      throw new Error(error.message);
    }

    logger.success('AUTH: Logout exitoso');
  }

  async getCurrentUser(accessToken: string): Promise<AuthUser | null> {
    logger.info('AUTH: Obteniendo usuario actual');

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      logger.warning('AUTH: No se pudo obtener usuario actual');
      return null;
    }

    logger.success('AUTH: Usuario actual obtenido', { userId: data.user.id });

    return {
      id: data.user.id,
      email: data.user.email || '',
      fullName: data.user.user_metadata?.full_name || '',
      phone: data.user.user_metadata?.phone,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthSession> {
    logger.info('AUTH: Refrescando token');

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session || !data.user) {
      logger.error('AUTH: Error al refrescar token', { error: error?.message });
      throw new Error('Error al refrescar sesión');
    }

    logger.success('AUTH: Token refrescado', { userId: data.user.id });

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        fullName: data.user.user_metadata?.full_name || '',
      },
    };
  }
}
