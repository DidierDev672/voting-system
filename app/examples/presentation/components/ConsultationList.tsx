/**
 * Ejemplo de Componente: Lista de Consultas
 * Uso de hooks con arquitectura SOLID
 */

'use client';

import { useConsultations } from '@/app/core/presentation/hooks/use-api';
import { PopularConsultation } from '@/app/core/domain/types';

export default function ConsultationList() {
  const { consultations, loading, error } = useConsultations();

  if (loading) {
    return <div className="loading">Cargando consultas...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="consultation-list">
      <h1>Consultas Populares</h1>
      
      {consultations.length === 0 ? (
        <p>No hay consultas disponibles</p>
      ) : (
        <ul>
          {consultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ConsultationCard({ consultation }: { consultation: PopularConsultation }) {
  const statusColors = {
    draft: 'gray',
    published: 'green',
    closed: 'red',
  };

  return (
    <li className="consultation-card">
      <h2>{consultation.title}</h2>
      <p>{consultation.description}</p>
      <div className="meta">
        <span className={`status ${statusColors[consultation.status]}`}>
          {consultation.status}
        </span>
        <span className="questions">
          {consultation.questions.length} preguntas
        </span>
      </div>
    </li>
  );
}
