/**
 * Domain Types - Alcaldia
 * Vertical Slicing + SOLID Principles
 */

export type OrdenEntidad = 'Municipal' | 'Distrital';

export interface Alcaldia {
  id: string;
  nombreEntidad: string;
  nit: string;
  codigoSigep: string;
  ordenEntidad: OrdenEntidad;
  municipio: string;
  direccionFisica: string;
  dominio: string;
  correoInstitucional: string;
  idAlcalde: string;
  nombreAlcalde: string;
  actoPosesion: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAlcaldiaDTO {
  nombre_entidad: string;
  nit: string;
  codigo_sigep: string;
  orden_entidad: OrdenEntidad;
  municipio: string;
  direccion_fisica: string;
  dominio: string;
  correo_institucional: string;
  id_alcalde: string;
  nombre_alcalde: string;
  acto_posesion: string;
}

export interface UpdateAlcaldiaDTO {
  nombre_entidad?: string;
  nit?: string;
  codigo_sigep?: string;
  orden_entidad?: OrdenEntidad;
  municipio?: string;
  direccion_fisica?: string;
  dominio?: string;
  correo_institucional?: string;
  id_alcalde?: string;
  nombre_alcalde?: string;
  acto_posesion?: string;
}
