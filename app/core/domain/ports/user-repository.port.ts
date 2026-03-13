/**
 * Puerto de Repositorio de Usuario
 * Principios SOLID:
 * - Interface Segregation: интерфейс específico para usuarios
 * - Dependency Inversion: depende de abstracciones, no de implementaciones
 */

import { User, CreateUserDTO, UpdateUserDTO } from '../../domain/types';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByAuthId(authId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<boolean>;
}
