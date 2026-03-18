/**
 * Tipos de Voto
 * Vertical Slicing: Domain Layer
 */

export interface Vote {
  id: string;
  idConsult: string;
  idMember: string;
  idParty: string;
  idAuth: string;
  valueVote: boolean;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoteDTO {
  idConsult: string;
  idMember: string;
  idParty: string;
  idAuth?: string;
  valueVote: boolean;
  comment?: string;
}

export interface VoteResponse {
  success: boolean;
  vote?: Vote;
  error?: string;
}

export interface VoteSummary {
  idConsult: string;
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
