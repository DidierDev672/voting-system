/**
 * API Route: Consulta Individual
 * Next.js App Router - Handler de solicitudes HTTP
 */

import { NextRequest, NextResponse } from 'next/server';
import { SupabaseConsultationRepository } from '@/app/core/infrastructure/repositories';
import {
  GetConsultationByIdUseCase,
  PublishConsultationUseCase,
  CloseConsultationUseCase,
} from '@/app/core/application/usecases';

const repository = new SupabaseConsultationRepository();

// GET /api/consultations/[id] - Obtener consulta por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const useCase = new GetConsultationByIdUseCase(repository);
    const consultation = await useCase.execute(id);

    if (!consultation) {
      return NextResponse.json(
        { success: false, error: 'Consulta no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT /api/consultations/[id] - Publicar o cerrar consulta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    let useCase;

    if (action === 'publish') {
      useCase = new PublishConsultationUseCase(repository);
    } else if (action === 'close') {
      useCase = new CloseConsultationUseCase(repository);
    } else {
      return NextResponse.json(
        { success: false, error: 'Acción no válida' },
        { status: 400 }
      );
    }

    const consultation = await useCase.execute(id);

    return NextResponse.json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('no encontrada') ? 404 : 400;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}

// DELETE /api/consultations/[id] - Eliminar consulta
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await repository.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Consulta eliminada correctamente',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
