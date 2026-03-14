/**
 * Puerto de Autenticación
 * Principios SOLID:
 * - Interface Segregation: interfaz específica para autenticación
 * - Dependency Inversion: depende de abstracciones
 */

import { AuthUser, AuthSession, LoginDTO } from '../../domain/types/auth';

export interface IAuthPort {
  login(
    credentials: LoginDTO,
  ): Promise<{ user: AuthUser; session: AuthSession }>;
  logout(accessToken: string): Promise<void>;
  getCurrentUser(accessToken: string): Promise<AuthUser | null>;
  refreshToken(refreshToken: string): Promise<AuthSession>;
}
