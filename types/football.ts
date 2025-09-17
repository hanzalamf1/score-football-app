// Futbol API Veri Tipleri

// Lig/Yarışma
export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  plan: string;
  currentSeason: Season;
  numberOfAvailableSeasons: number;
  lastUpdated: string;
}

// Sezon
export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: Team | null;
}

// Takım
export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  runningCompetitions: Competition[];
  coach: Person;
  squad: Person[];
  staff: Person[];
  lastUpdated: string;
}

// Oyuncu/Kişi
export interface Person {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  position: string;
  shirtNumber: number;
  lastUpdated: string;
}

// Maç
export interface Match {
  id: number;
  competition: Competition;
  season: Season;
  utcDate: string;
  status: MatchStatus;
  minute: number;
  injuryTime: number;
  venue: string;
  matchday: number;
  stage: string;
  group: string;
  lastUpdated: string;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  goals: Goal[];
  bookings: Booking[];
  substitutions: Substitution[];
  odds: Odds;
  referees: Referee[];
}

// Maç Durumu
export type MatchStatus = 
  | 'SCHEDULED' 
  | 'LIVE' 
  | 'IN_PLAY' 
  | 'PAUSED' 
  | 'FINISHED' 
  | 'POSTPONED' 
  | 'SUSPENDED' 
  | 'CANCELLED';

// Skor
export interface Score {
  winner: string | null;
  duration: string;
  fullTime: ScoreDetail;
  halfTime: ScoreDetail;
}

export interface ScoreDetail {
  home: number | null;
  away: number | null;
}

// Gol
export interface Goal {
  minute: number;
  injuryTime: number | null;
  type: string;
  team: Team;
  scorer: Person;
  assist: Person | null;
  score: ScoreDetail;
}

// Kart
export interface Booking {
  minute: number;
  team: Team;
  player: Person;
  card: string;
}

// Oyuncu Değişikliği
export interface Substitution {
  minute: number;
  team: Team;
  playerOut: Person;
  playerIn: Person;
}

// Bahis Oranları
export interface Odds {
  msg: string;
}

// Hakem
export interface Referee {
  id: number;
  name: string;
  role: string;
  nationality: string;
}

// Sıralama
export interface Standing {
  position: number;
  team: Team;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

// Gol Krallığı
export interface Scorer {
  player: Person;
  team: Team;
  playedMatches: number;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

// Bölge
export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string;
}

// API Yanıt Tipleri
export interface ApiResponse<T> {
  count: number;
  filters: any;
  competition?: Competition;
  season?: Season;
  matches?: Match[];
  standings?: Standing[];
  teams?: Team[];
  scorers?: Scorer[];
  areas?: Area[];
  competitions?: Competition[];
  persons?: Person[];
}

// Filtre Tipleri
export interface MatchFilters {
  dateFrom?: string;
  dateTo?: string;
  season?: number;
  competitions?: string;
  status?: MatchStatus;
  venue?: 'HOME' | 'AWAY';
  limit?: number;
  matchday?: number;
  stage?: string;
  group?: string;
}

export interface TeamFilters {
  limit?: number;
  offset?: number;
}

export interface PersonFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: MatchStatus;
  competitions?: string;
  limit?: number;
  offset?: number;
}

export interface CompetitionFilters {
  areas?: string;
}

export interface StandingFilters {
  matchday?: number;
  season?: number;
  date?: string;
}

export interface ScorerFilters {
  limit?: number;
  season?: number;
}
