export interface Partido {
  id: string;
  name: string;
  acronym: string;
  party_type: string;
  ideology: string;
  legal_representative: string;
  representative_id: string;
  email: string;
  foundation_date: string;
  is_active: boolean;
  created_at?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getPartidos(): Promise<Partido[]> {
  const response = await fetch(`${API_URL}/api/political-parties/`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.data || [];
}

export async function getPartidoById(id: string): Promise<Partido | null> {
  try {
    const response = await fetch(`${API_URL}/api/political-parties/${id}/`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch {
    return null;
  }
}
