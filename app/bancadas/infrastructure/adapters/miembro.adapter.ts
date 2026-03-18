export interface Miembro {
  id: string;
  full_name: string;
  document_type: string;
  document_number: string;
  birth_date: string;
  city: string;
  political_party_id: string;
  consent: boolean;
  data_authorization: boolean;
  affiliation_date: string;
  created_at?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getMiembros(): Promise<Miembro[]> {
  const response = await fetch(`${API_URL}/api/party-members/`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.data || [];
}

export async function getMiembroById(id: string): Promise<Miembro | null> {
  try {
    const response = await fetch(`${API_URL}/api/party-members/${id}/`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch {
    return null;
  }
}
