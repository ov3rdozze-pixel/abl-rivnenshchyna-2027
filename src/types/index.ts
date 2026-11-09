export interface Team {
  id: string;
  name: string; // Strictly uppercase e.g. БК «КОЗИРІ»
  shortName: string;
  logoUrl: string;
  city: string;
  description: string;
  history: string;
  coach: string;
  homeArena: string;
  foundedYear?: number;
  primaryColor: string;
  secondaryColor: string;
  contactEmail?: string;
  contactPhone?: string;
}

export type PlayerPosition = 'PG' | 'SG' | 'SF' | 'PF' | 'C' | 'G' | 'F';

export interface PlayerStats {
  games: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  minutes?: number;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: number;
  position: PlayerPosition;
  positionNameUk: string;
  heightCm?: number;
  birthYear?: number;
  photoUrl?: string;
  stats: PlayerStats;
}

export interface MatchScoreQuarter {
  q1Home: number;
  q1Away: number;
  q2Home: number;
  q2Away: number;
  q3Home: number;
  q3Away: number;
  q4Home: number;
  q4Away: number;
  otHome?: number;
  otAway?: number;
}

export interface MatchTopPerformer {
  playerId?: string;
  playerName: string;
  teamId: string;
  points: number;
  rebounds: number;
  assists: number;
}

export interface Match {
  id: string;
  round: number; // Тур 1, 2, 3...
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  venue: string;
  status: 'upcoming' | 'completed' | 'live';
  quarters?: MatchScoreQuarter;
  topPerformers?: MatchTopPerformer[];
  notes?: string;
}

export interface StandingsRow {
  rank: number;
  teamId: string;
  team: Team;
  played: number;
  wins: number;
  losses: number;
  pointsScored: number;
  pointsAllowed: number;
  pointsDiff: number;
  points: number;
  form: ('W' | 'L')[];
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
  category: string;
  featured?: boolean;
}

export interface PlayoffMatch {
  homeTeamId?: string;
  awayTeamId?: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'completed';
  winnerTeamId?: string;
}

export interface FinalFourConfig {
  isActive: boolean; // Default FALSE
  title: string;
  season: string;
  qualifiedTeamIds: string[]; // 4 team IDs
  semiFinal1: PlayoffMatch;
  semiFinal2: PlayoffMatch;
  thirdPlaceMatch: PlayoffMatch & { enabled: boolean };
  finalMatch: PlayoffMatch;
  championTeamId?: string;
  mvpPlayerName?: string;
  notes?: string;
  announcementDate?: string;
}

export interface RoundMvpAward {
  id: string;
  round: number; // Номер туру (1, 2, 3...)
  playerId?: string;
  playerName: string;
  teamId: string;
  photoUrl?: string;
  matchInfo?: string; // Наприклад: «Проти БК «ШПАНІВ» (88:74)»
  points: number;
  rebounds: number;
  assists: number;
  steals?: number;
  blocks?: number;
  efficiency?: number;
  description?: string;
  date?: string;
}

export interface MvpPlayerLeaderboard {
  playerName: string;
  teamId: string;
  mvpCount: number;
  awards: RoundMvpAward[];
  photoUrl?: string;
  position?: string;
}

export interface StandingsOverride {
  played?: number;
  wins?: number;
  losses?: number;
  pointsScored?: number;
  pointsAllowed?: number;
  pointsDiff?: number;
  points?: number;
}

export interface LeagueSettings {
  seasonName: string;
  winPoints: number; // 2
  lossPoints: number; // 1
  forfeitPoints: number; // 0
  standingsMode: 'auto' | 'manual'; // 'auto' from matches or 'manual' with custom sorting & overrides
  manualOrder?: string[]; // teamIds in manual order
  standingsOverrides?: Record<string, StandingsOverride>;
  donationCard?: string;
}

export interface LeagueDatabase {
  version: string;
  lastUpdated: string;
  settings: LeagueSettings;
  teams: Team[];
  players: Player[];
  matches: Match[];
  news: NewsItem[];
  finalFour: FinalFourConfig;
  mvpAwards: RoundMvpAward[];
}
