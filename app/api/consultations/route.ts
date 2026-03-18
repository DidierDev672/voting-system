/**
 * API Route: Consultas Populares
 * Next.js App Router - Handler de solicitudes HTTP
 * Principios SOLID:
 * - Single Responsibility: manejar solicitudes HTTP para consultas
 */

import { NextRequest, NextResponse } from 'next/server';
import { SupabaseConsultationRepository } from '@/app/core/infrastructure/repositories';
import {
  GetAllConsultationsUseCase,
  GetConsultationByIdUseCase,
  CreateConsultationUseCase,
  PublishConsultationUseCase,
  CloseConsultationUseCase,
} from '@/app/core/application/usecases';

const repository = new SupabaseConsultationRepository();

// GET /api/consultations - Obtener todas las consultas
export async function GET(request: NextRequest) {
  try {
    const useCase = new GetAllConsultationsUseCase(repository);
    const consultations = await useCase.execute();

    return NextResponse.json({
      success: true,
      data: consultations,
      count: consultations.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

// POST /api/consultations - Crear una consulta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const useCase = new CreateConsultationUseCase(repository);
    const consultation = await useCase.execute(body);

    return NextResponse.json(
      { success: true, data: consultation },
      { status: 201 },
    );
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('requerido') ? 400 : 500;

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
