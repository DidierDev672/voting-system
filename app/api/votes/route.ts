/**
 * API Route: Votos
 * Next.js App Router - Handler de solicitudes HTTP
 * Principios SOLID:
 * - Single Responsibility: manejar solicitudes HTTP para votos
 */

import { NextRequest, NextResponse } from 'next/server';
import { SupabaseVoteRepository } from '@/app/core/infrastructure/repositories';
import {
  RegisterVoteUseCase,
  GetVotesByConsultationUseCase,
  GetVotesByMemberUseCase,
} from '@/app/core/application/usecases';

const repository = new SupabaseVoteRepository();

// GET /api/votes - Obtener votos (por consulta o miembro)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idConsult = searchParams.get('idConsult');
    const idMember = searchParams.get('idMember');

    let votes;

    if (idConsult) {
      const useCase = new GetVotesByConsultationUseCase(repository);
      votes = await useCase.execute(idConsult);
    } else if (idMember) {
      const useCase = new GetVotesByMemberUseCase(repository);
      votes = await useCase.execute(idMember);
    } else {
      return NextResponse.json(
        { success: false, error: 'Se requiere idConsult o idMember' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      data: votes,
      count: votes.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

// POST /api/votes - Registrar un voto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const useCase = new RegisterVoteUseCase(repository);
    const vote = await useCase.execute(body);

    return NextResponse.json({ success: true, data: vote }, { status: 201 });
  } catch (error) {
    const message = (error as Error).message;
    const status = message.includes('ya ha') ? 409 : 400;

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
