// API Yapılandırması
export const API_CONFIG = {
  // Football Data API v4
  BASE_URL: 'https://api.football-data.org/v4',
  
  // API Token'ı
  AUTH_TOKEN: 'c89c05b32370482aaefe0d4b8dfab09f',
  
  // Timeout süresi (milisaniye)
  TIMEOUT: 10000,
  
  // Retry sayısı
  MAX_RETRIES: 3,
  
  // Cache süresi (milisaniye)
  CACHE_DURATION: 5 * 60 * 1000, // 5 dakika
};

// Environment kontrolü
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

// Football Data API endpoint'leri
export const API_ENDPOINTS = {
  // Ligler
  COMPETITIONS: '/competitions',
  COMPETITION: (id: string) => `/competitions/${id}`,
  COMPETITION_STANDINGS: (id: string) => `/competitions/${id}/standings`,
  COMPETITION_MATCHES: (id: string) => `/competitions/${id}/matches`,
  COMPETITION_TEAMS: (id: string) => `/competitions/${id}/teams`,
  COMPETITION_SCORERS: (id: string) => `/competitions/${id}/scorers`,
  
  // Takımlar
  TEAMS: '/teams',
  TEAM: (id: number) => `/teams/${id}`,
  TEAM_MATCHES: (id: number) => `/teams/${id}/matches`,
  
  // Maçlar
  MATCHES: '/matches',
  MATCH: (id: number) => `/matches/${id}`,
  MATCH_HEAD2HEAD: (id: number) => `/matches/${id}/head2head`,
  
  // Oyuncular
  PERSONS: '/persons',
  PERSON: (id: number) => `/persons/${id}`,
  PERSON_MATCHES: (id: number) => `/persons/${id}/matches`,
  
  // Bölgeler
  AREAS: '/areas',
  AREA: (id: number) => `/areas/${id}`,
};

// HTTP Status kodları
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
