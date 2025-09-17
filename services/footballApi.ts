import { API_ENDPOINTS } from '@/constants/Config';
import {
    ApiResponse,
    Area,
    Competition,
    CompetitionFilters,
    Match,
    MatchFilters,
    Person,
    PersonFilters,
    Scorer,
    ScorerFilters,
    Standing,
    StandingFilters,
    Team,
    TeamFilters,
} from '@/types/football';
import { apiService } from './api';

// Futbol API Servisleri
export const footballApiService = {
  // === LİGLER ===
  
  // Tüm ligleri getir
  getCompetitions: async (filters?: CompetitionFilters): Promise<ApiResponse<Competition>> => {
    return apiService.get<ApiResponse<Competition>>(API_ENDPOINTS.COMPETITIONS, filters);
  },

  // Belirli bir ligi getir
  getCompetition: async (id: string): Promise<Competition> => {
    return apiService.get<Competition>(API_ENDPOINTS.COMPETITION(id));
  },

  // Lig sıralaması
  getCompetitionStandings: async (id: string, filters?: StandingFilters): Promise<ApiResponse<Standing>> => {
    return apiService.get<ApiResponse<Standing>>(API_ENDPOINTS.COMPETITION_STANDINGS(id), filters);
  },

  // Lig maçları
  getCompetitionMatches: async (id: string, filters?: MatchFilters): Promise<ApiResponse<Match>> => {
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.COMPETITION_MATCHES(id), filters);
  },

  // Lig takımları
  getCompetitionTeams: async (id: string, season?: number): Promise<ApiResponse<Team>> => {
    const filters = season ? { season } : undefined;
    return apiService.get<ApiResponse<Team>>(API_ENDPOINTS.COMPETITION_TEAMS(id), filters);
  },

  // Gol krallığı
  getCompetitionScorers: async (id: string, filters?: ScorerFilters): Promise<ApiResponse<Scorer>> => {
    return apiService.get<ApiResponse<Scorer>>(API_ENDPOINTS.COMPETITION_SCORERS(id), filters);
  },

  // === TAKIMLAR ===
  
  // Tüm takımları getir
  getTeams: async (filters?: TeamFilters): Promise<ApiResponse<Team>> => {
    return apiService.get<ApiResponse<Team>>(API_ENDPOINTS.TEAMS, filters);
  },

  // Belirli bir takımı getir
  getTeam: async (id: number): Promise<Team> => {
    return apiService.get<Team>(API_ENDPOINTS.TEAM(id));
  },

  // Takım maçları
  getTeamMatches: async (id: number, filters?: MatchFilters): Promise<ApiResponse<Match>> => {
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.TEAM_MATCHES(id), filters);
  },

  // === MAÇLAR ===
  
  // Tüm maçları getir
  getMatches: async (filters?: MatchFilters): Promise<ApiResponse<Match>> => {
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.MATCHES, filters);
  },

  // Belirli bir maçı getir
  getMatch: async (id: number): Promise<Match> => {
    return apiService.get<Match>(API_ENDPOINTS.MATCH(id));
  },

  // Head-to-head maçlar
  getMatchHead2Head: async (id: number, filters?: MatchFilters): Promise<ApiResponse<Match>> => {
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.MATCH_HEAD2HEAD(id), filters);
  },

  // === OYUNCULAR ===
  
  // Belirli bir oyuncuyu getir
  getPerson: async (id: number): Promise<Person> => {
    return apiService.get<Person>(API_ENDPOINTS.PERSON(id));
  },

  // Oyuncu maçları
  getPersonMatches: async (id: number, filters?: PersonFilters): Promise<ApiResponse<Match>> => {
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.PERSON_MATCHES(id), filters);
  },

  // === BÖLGELER ===
  
  // Tüm bölgeleri getir
  getAreas: async (): Promise<ApiResponse<Area>> => {
    return apiService.get<ApiResponse<Area>>(API_ENDPOINTS.AREAS);
  },

  // Belirli bir bölgeyi getir
  getArea: async (id: number): Promise<Area> => {
    return apiService.get<Area>(API_ENDPOINTS.AREA(id));
  },

  // === YARDIMCI FONKSİYONLAR ===
  
  // Bugünün maçlarını getir
  getTodaysMatches: async (): Promise<ApiResponse<Match>> => {
    const today = new Date().toISOString().split('T')[0];
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.MATCHES, { dateFrom: today, dateTo: today });
  },

  // Bu haftanın maçlarını getir
  getThisWeeksMatches: async (): Promise<ApiResponse<Match>> => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);
    
    const dateFrom = today.toISOString().split('T')[0];
    const dateTo = endOfWeek.toISOString().split('T')[0];
    
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.MATCHES, { dateFrom, dateTo });
  },

  // Canlı maçları getir
  getLiveMatches: async (): Promise<ApiResponse<Match>> => {
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.MATCHES, { status: 'LIVE' });
  },

  // Tamamlanan maçları getir
  getFinishedMatches: async (limit: number = 20): Promise<ApiResponse<Match>> => {
    return apiService.get<ApiResponse<Match>>(API_ENDPOINTS.MATCHES, { status: 'FINISHED', limit });
  },

  // Premier League bilgileri
  getPremierLeague: async () => {
    return {
      competition: await footballApiService.getCompetition('PL'),
      standings: await footballApiService.getCompetitionStandings('PL'),
      topScorers: await footballApiService.getCompetitionScorers('PL', { limit: 10 }),
    };
  },

  getTeams: async (filters?: TeamFilters): Promise<ApiResponse<Team>> => {
    return apiService.get<ApiResponse<Team>>(API_ENDPOINTS.TEAMS, filters);
  },

  // La Liga bilgileri
  getLaLiga: async () => {
    return {
      competition: await footballApiService.getCompetition('ES1'),
      standings: await footballApiService.getCompetitionStandings('ES1'),
      topScorers: await footballApiService.getCompetitionScorers('ES1', { limit: 10 }),
    };
  },

  // Bundesliga bilgileri
  getBundesliga: async () => {
    return {
      competition: await footballApiService.getCompetition('BL1'),
      standings: await footballApiService.getCompetitionStandings('BL1'),
      topScorers: await footballApiService.getCompetitionScorers('BL1', { limit: 10 }),
    };
  },

  // Serie A bilgileri
  getSerieA: async () => {
    return {
      competition: await footballApiService.getCompetition('SA'),
      standings: await footballApiService.getCompetitionStandings('SA'),
      topScorers: await footballApiService.getCompetitionScorers('SA', { limit: 10 }),
    };
  },

  // Şampiyonlar Ligi bilgileri
  getChampionsLeague: async () => {
    return {
      competition: await footballApiService.getCompetition('CL'),
      matches: await footballApiService.getCompetitionMatches('CL'),
    };
  },
};
