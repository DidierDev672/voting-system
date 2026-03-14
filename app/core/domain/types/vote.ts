/**
 * Tipos de Voto
 * Vertical Slicing: Domain Layer
 */

export interface Vote {
  id: string;
  consultationId: string;
  memberId: string;
  memberDocumentNumber?: string;
  partyId: string;
  authId: string;
  valueVote: boolean;
  comment?: string;
  createdAt: string;
}

export interface CreateVoteDTO {
  consultationId: string;
  memberId: string;
  partyId: string;
  authId?: string;
  valueVote: boolean;
  comment?: string;
}

export interface VoteResponse {
  success: boolean;
  vote?: Vote;
  error?: string;
}

export interface VoteSummary {
  consultationId: string;
  consultationTitle: string;
  totalVotes: number;
  votesInFavor: number;
  votesAgainst: number;
}

export interface VoteDetail {
  id: string;
  memberName?: string;
  partyName?: string;
  partyAcronym?: string;
  valueVote: boolean;
  comment?: string;
  createdAt: string;
  result?: 'winner' | 'loser' | 'tie';
}
