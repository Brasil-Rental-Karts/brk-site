const CACHE_API_URL = import.meta.env.VITE_CACHE_API_URL;

export interface Championship {
  id: string;
  slug?: string;
  name: string;
  championshipImage?: string;
  shortDescription: string;
  fullDescription?: string;
  sponsors?: Sponsor[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoImage: string;
  website?: string;
}

export interface ChampionshipWithSeasons extends Championship {
  seasons: Season[];
}

export interface Season {
  id: string;
  name: string;
  slug?: string;
  startDate: string;
  endDate: string;
  championshipId: string;
  registrationOpen?: boolean;
}

export interface Category {
  id: string;
  name: string;
  ballast: number;
  maxPilots: number;
  minimumAge: number;
  seasonId: string;
}

export interface Stage {
  id: string;
  name: string;
  date: string;
  time: string;
  kartodrome: string;
  streamLink?: string;
  briefing?: string;
  seasonId: string;
}

export interface ApiResponse<T> {
  count?: number;
  data: T;
  performance?: {
    networkCalls: number;
    optimized: boolean;
    seasonsCount?: number;
  };
}

class ChampionshipService {
  private async request<T>(endpoint: string): Promise<T> {
    if (!CACHE_API_URL) {
      throw new Error('VITE_CACHE_API_URL is not configured');
    }

    const response = await fetch(`${CACHE_API_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Busca todos os campeonatos do cache
   */
  async getAllChampionships(): Promise<Championship[]> {
    try {
      const response = await this.request<ApiResponse<Championship[]>>('/cache/championships');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch championships:', error);
      return [];
    }
  }

  /**
   * Busca um campeonato específico pelo ID
   */
  async getChampionshipById(id: string): Promise<Championship | null> {
    try {
      const response = await this.request<ApiResponse<Championship>>(`/cache/championships/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch championship ${id}:`, error);
      return null;
    }
  }

  /**
   * Busca um campeonato com todas as suas temporadas
   */
  async getChampionshipWithSeasons(id: string): Promise<ChampionshipWithSeasons | null> {
    try {
      const response = await this.request<ApiResponse<ChampionshipWithSeasons>>(`/cache/championships/${id}/seasons`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch championship with seasons ${id}:`, error);
      return null;
    }
  }

  /**
   * Busca campeonato pelo nome (implementação de busca local)
   */
  async findChampionshipByName(name: string): Promise<Championship | null> {
    try {
      const championships = await this.getAllChampionships();
      return championships.find(c => 
        c.name.toLowerCase() === name.toLowerCase() ||
        c.name.toLowerCase().includes(name.toLowerCase())
      ) || null;
    } catch (error) {
      console.error(`Failed to find championship by name ${name}:`, error);
      return null;
    }
  }

  /**
   * Busca campeonatos com filtros de busca
   */
  async searchChampionships(query: string): Promise<Championship[]> {
    try {
      const championships = await this.getAllChampionships();
      if (!query.trim()) return championships;

      const searchTerm = query.toLowerCase();
      return championships.filter(championship => 
        championship.name.toLowerCase().includes(searchTerm) ||
        championship.shortDescription?.toLowerCase().includes(searchTerm) ||
        championship.fullDescription?.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error(`Failed to search championships with query ${query}:`, error);
      return [];
    }
  }

  /**
   * Busca todas as temporadas do cache
   */
  async getAllSeasons(): Promise<Season[]> {
    try {
      const response = await this.request<ApiResponse<Season[]>>('/cache/seasons');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch seasons:', error);
      return [];
    }
  }

  /**
   * Busca todas as categorias do cache
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await this.request<ApiResponse<Category[]>>('/cache/categories');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  /**
   * Verifica se uma temporada está ativa na data atual
   */
  isSeasonActive(season: Season): boolean {
    const now = new Date();
    const startDate = new Date(season.startDate);
    const endDate = new Date(season.endDate);
    return now >= startDate && now <= endDate;
  }

  /**
   * Busca temporadas ativas para um campeonato
   */
  async getActiveSeasonsForChampionship(championshipId: string): Promise<Season[]> {
    try {
      const seasons = await this.getAllSeasons();
      return seasons.filter(season => 
        season.championshipId === championshipId && this.isSeasonActive(season)
      );
    } catch (error) {
      console.error(`Failed to fetch active seasons for championship ${championshipId}:`, error);
      return [];
    }
  }

  /**
   * Busca categorias ativas para temporadas ativas de um campeonato
   */
  async getActiveCategoriesForChampionship(championshipId: string): Promise<Category[]> {
    try {
      const activeSeasons = await this.getActiveSeasonsForChampionship(championshipId);
      const categories = await this.getAllCategories();
      
      const activeSeasonIds = activeSeasons.map(season => season.id);
      return categories.filter(category => activeSeasonIds.includes(category.seasonId));
    } catch (error) {
      console.error(`Failed to fetch active categories for championship ${championshipId}:`, error);
      return [];
    }
  }

  /**
   * Busca todas as etapas do cache
   */
  async getAllStages(): Promise<Stage[]> {
    try {
      const response = await this.request<ApiResponse<Stage[]>>('/cache/stages');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch stages:', error);
      return [];
    }
  }

  /**
   * Busca etapas para um campeonato específico
   */
  async getStagesForChampionship(championshipId: string): Promise<Stage[]> {
    try {
      const seasons = await this.getAllSeasons();
      const stages = await this.getAllStages();
      
      const championshipSeasonIds = seasons
        .filter(season => season.championshipId === championshipId)
        .map(season => season.id);
      
      return stages.filter(stage => championshipSeasonIds.includes(stage.seasonId));
    } catch (error) {
      console.error(`Failed to fetch stages for championship ${championshipId}:`, error);
      return [];
    }
  }

  /**
   * Busca etapas para uma temporada específica
   */
  async getStagesForSeason(seasonId: string): Promise<Stage[]> {
    try {
      const stages = await this.getAllStages();
      return stages.filter(stage => stage.seasonId === seasonId);
    } catch (error) {
      console.error(`Failed to fetch stages for season ${seasonId}:`, error);
      return [];
    }
  }

  /**
   * Formata uma etapa para o formato esperado pelo UI
   */
  formatStageForUI(stage: Stage): any {
    const stageDate = new Date(stage.date);
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    return {
      id: parseInt(stage.id.slice(-4), 16), // Gera um ID numérico baseado no UUID
      date: stageDate.getDate().toString().padStart(2, '0'),
      month: months[stageDate.getMonth()],
      day: days[stageDate.getDay()],
      stage: stage.name,
      location: stage.kartodrome,
      time: stage.time || 'A partir das 14h',
      status: stageDate > new Date() ? 'Programado' : 'Finalizado',
      streamLink: stage.streamLink,
      briefing: stage.briefing
    };
  }
}

export const championshipService = new ChampionshipService(); 