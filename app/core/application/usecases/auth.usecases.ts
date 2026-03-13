/**
 * Caso de Uso: Iniciar Sesión
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de autenticación
 * - Dependency Inversion: depende de IAuthPort
 */

import { IAuthPort } from '../../domain/ports/auth.port';
import { LoginDTO, AuthUser, AuthSession } from '../../domain/types/auth';

export class LoginUseCase {
  constructor(private readonly authPort: IAuthPort) {}

  async execute(credentials: LoginDTO): Promise<{ user: AuthUser; session: AuthSession }> {
    // Validaciones de negocio
    if (!credentials.email || !credentials.email.includes('@')) {
      throw new Error('Correo electrónico inválido');
    }

    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Delegar al puerto de autenticación
    return this.authPort.login(credentials);
  }
}
