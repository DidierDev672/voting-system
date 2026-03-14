/**
 * Caso de Uso: Iniciar Sesión
 * Principios SOLID:
 * - Single Responsibility: lógica de negocio de autenticación
 * - Dependency Inversion: depende de IAuthPort
 */

import { IAuthPort } from '../../domain/ports/auth.port';
import { LoginDTO, AuthUser, AuthSession } from '../../domain/types/auth';
import { logger } from '../../infrastructure/logger/logger';

export class LoginUseCase {
  constructor(private readonly authPort: IAuthPort) {}

  async execute(
    credentials: LoginDTO,
  ): Promise<{ user: AuthUser; session: AuthSession }> {
    logger.info('USECASE: Iniciando LoginUseCase', {
      email: credentials.email,
    });

    // Validaciones de negocio
    if (!credentials.email || !credentials.email.includes('@')) {
      logger.warning('USECASE: Email inválido', { email: credentials.email });
      throw new Error('Correo electrónico inválido');
    }

    if (!credentials.password || credentials.password.length < 6) {
      logger.warning('USECASE: Contraseña muy corta');
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Delegar al puerto de autenticación
    try {
      const result = await this.authPort.login(credentials);
      logger.success('USECASE: LoginUseCase completado exitosamente', {
        userId: result.user.id,
      });
      return result;
    } catch (error) {
      console.log('Error en LoginUseCase:', error);
      logger.error('USECASE: Error en LoginUseCase', {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}
