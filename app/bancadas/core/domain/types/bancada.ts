export type TipoCurul = "Ordinaria" | "Estatuto de Oposición" | "Reemplazo";

export type ComisionPermanente = 
  | "Comisión de Presupuesto"
  | "Comisión de Plan de Desarrollo"
  | "Comisión de Gobierno"
  | "Comisión de Hacienda"
  | "Comisión de Educación"
  | "Comisión de Salud"
  | "Comisión de Infraestructura"
  | "Comisión de Agricultura"
  | "Comisión de Ambiente"
  | "Comisión de Participación Ciudadana";

export interface Bancada {
  id?: string;
  id_miembro: string;
  id_partido: string;
  tipo_curul: TipoCurul;
  fin_periodo: string;
  declaraciones_bienes: string;
  antecedentes_siri_sirus: string;
  comision_permanente: ComisionPermanente;
  correo_institucional: string;
  profesion: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBancadaDTO {
  id_miembro: string;
  id_partido: string;
  tipo_curul: TipoCurul;
  fin_periodo: string;
  declaraciones_bienes: string;
  antecedentes_siri_sirus: string;
  comision_permanente: ComisionPermanente;
  correo_institucional: string;
  profesion: string;
}

export const TIPO_CURUL_OPTIONS: { value: TipoCurul; label: string }[] = [
  { value: "Ordinaria", label: "Ordinaria" },
  { value: "Estatuto de Oposición", label: "Estatuto de Oposición" },
  { value: "Reemplazo", label: "Reemplazo" },
];

export const COMISION_OPTIONS: { value: ComisionPermanente; label: string }[] = [
  { value: "Comisión de Presupuesto", label: "Comisión de Presupuesto" },
  { value: "Comisión de Plan de Desarrollo", label: "Comisión de Plan de Desarrollo" },
  { value: "Comisión de Gobierno", label: "Comisión de Gobierno" },
  { value: "Comisión de Hacienda", label: "Comisión de Hacienda" },
  { value: "Comisión de Educación", label: "Comisión de Educación" },
  { value: "Comisión de Salud", label: "Comisión de Salud" },
  { value: "Comisión de Infraestructura", label: "Comisión de Infraestructura" },
  { value: "Comisión de Agricultura", label: "Comisión de Agricultura" },
  { value: "Comisión de Ambiente", label: "Comisión de Ambiente" },
  { value: "Comisión de Participación Ciudadana", label: "Comisión de Participación Ciudadana" },
];

export function formatTipoCurul(value: string): string {
  if (value.startsWith("TipoCurul.")) {
    return value.replace("TipoCurul.", "").replace(/_/g, " ");
  }
  return value;
}

export function formatComision(value: string): string {
  if (value.startsWith("ComisionPermanente.")) {
    return value.replace("ComisionPermanente.", "").replace(/_/g, " ");
  }
  return value;
}
