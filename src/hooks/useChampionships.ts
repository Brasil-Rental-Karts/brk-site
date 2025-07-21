import { useState, useEffect, useCallback } from 'react';
import { championshipService, type Championship, type ChampionshipWithSeasons, type Season, type Category, type Stage, type RaceTrack } from '@/services/championship.service';

export interface UseChampionshipsReturn {
  championships: Championship[];
  seasons: Season[];
  categories: Category[];
  stages: Stage[];
  raceTracks: RaceTrack[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchChampionships: (query: string) => Promise<Championship[]>;
  getActiveSeasonsCount: (championshipId: string) => number;
  getActiveCategoriesCount: (championshipId: string) => number;
  getSeasonsForChampionship: (championshipId: string) => Season[];
  getStagesForSeason: (seasonId: string) => Stage[];
  getStagesForChampionship: (championshipId: string) => Stage[];
  getRaceTrackById: (id: string) => RaceTrack | null;
  getActiveRaceTracks: () => RaceTrack[];
  getRegulationsForSeason: (seasonId: string) => Promise<any[]>;
  getActiveRegulationsForChampionship: (championshipId: string) => Promise<any[]>;
  getRegulationsBySeasonForChampionship: (championshipId: string) => Promise<any[]>;
}

export interface UseChampionshipReturn {
  championship: Championship | null;
  championshipWithSeasons: ChampionshipWithSeasons | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadWithSeasons: () => Promise<void>;
}

/**
 * Hook para gerenciar múltiplos campeonatos
 */
export function useChampionships(): UseChampionshipsReturn {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [raceTracks, setRaceTracks] = useState<RaceTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar todos os dados em paralelo
      const [championshipsData, seasonsData, categoriesData, stagesData, raceTracksData] = await Promise.all([
        championshipService.getAllChampionships(),
        championshipService.getAllSeasons(),
        championshipService.getAllCategories(),
        championshipService.getAllStages(),
        championshipService.getAllRaceTracks()
      ]);
      
      setChampionships(championshipsData);
      setSeasons(seasonsData);
      setCategories(categoriesData);
      setStages(stagesData);
      setRaceTracks(raceTracksData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchChampionships = async (query: string): Promise<Championship[]> => {
    try {
      return await championshipService.searchChampionships(query);
    } catch (err) {
      console.error('Error searching championships:', err);
      return [];
    }
  };

  const getActiveSeasonsCount = (championshipId: string): number => {
    return seasons.filter(season => 
      season.championshipId === championshipId && 
      championshipService.isSeasonActive(season)
    ).length;
  };

  const getActiveCategoriesCount = (championshipId: string): number => {
    const activeSeasons = seasons.filter(season => 
      season.championshipId === championshipId && 
      championshipService.isSeasonActive(season)
    );
    const activeSeasonIds = activeSeasons.map(season => season.id);
    
    return categories.filter(category => 
      activeSeasonIds.includes(category.seasonId)
    ).length;
  };

  const getSeasonsForChampionship = (championshipId: string): Season[] => {
    return seasons.filter(season => season.championshipId === championshipId);
  };

  const getStagesForSeason = (seasonId: string): Stage[] => {
    return stages.filter(stage => stage.seasonId === seasonId);
  };

  const getStagesForChampionship = (championshipId: string): Stage[] => {
    const championshipSeasons = getSeasonsForChampionship(championshipId);
    const seasonIds = championshipSeasons.map(season => season.id);
    return stages.filter(stage => seasonIds.includes(stage.seasonId));
  };

  const getRaceTrackById = (id: string): RaceTrack | null => {
    return raceTracks.find(raceTrack => raceTrack.id === id) || null;
  };

  const getActiveRaceTracks = (): RaceTrack[] => {
    return raceTracks.filter(raceTrack => raceTrack.isActive);
  };

  // Buscar regulamentações por temporada
  const getRegulationsForSeason = useCallback(async (seasonId: string) => {
    try {
      return await championshipService.getRegulationsForSeason(seasonId);
    } catch (error) {
      console.error('Error fetching regulations for season:', error);
      return [];
    }
  }, []);

  // Buscar regulamentações ativas para um campeonato
  const getActiveRegulationsForChampionship = useCallback(async (championshipId: string) => {
    try {
      return await championshipService.getActiveRegulationsForChampionship(championshipId);
    } catch (error) {
      console.error('Error fetching active regulations for championship:', error);
      return [];
    }
  }, []);

  // Buscar regulamentações agrupadas por temporada para um campeonato
  const getRegulationsBySeasonForChampionship = useCallback(async (championshipId: string) => {
    try {
      return await championshipService.getRegulationsBySeasonForChampionship(championshipId);
    } catch (error) {
      console.error('Error fetching regulations by season for championship:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    championships,
    seasons,
    categories,
    stages,
    raceTracks,
    loading,
    error,
    refetch: fetchAllData,
    searchChampionships,
    getActiveSeasonsCount,
    getActiveCategoriesCount,
    getSeasonsForChampionship,
    getStagesForSeason,
    getStagesForChampionship,
    getRaceTrackById,
    getActiveRaceTracks,
    getRegulationsForSeason,
    getActiveRegulationsForChampionship,
    getRegulationsBySeasonForChampionship
  };
}

/**
 * Hook para gerenciar um campeonato específico
 */
export function useChampionship(id: string): UseChampionshipReturn {
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [championshipWithSeasons, setChampionshipWithSeasons] = useState<ChampionshipWithSeasons | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChampionship = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await championshipService.getChampionshipById(id);
      setChampionship(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar campeonato';
      setError(message);
      console.error('Error fetching championship:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWithSeasons = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await championshipService.getChampionshipWithSeasons(id);
      setChampionshipWithSeasons(data);
      if (data) {
        setChampionship(data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar campeonato com temporadas';
      setError(message);
      console.error('Error fetching championship with seasons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChampionship();
  }, [id]);

  return {
    championship,
    championshipWithSeasons,
    loading,
    error,
    refetch: fetchChampionship,
    loadWithSeasons
  };
}

/**
 * Hook para buscar campeonato por nome
 */
export function useChampionshipByName(name: string) {
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByName = async () => {
    if (!name?.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await championshipService.findChampionshipByName(name);
      setChampionship(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar campeonato';
      setError(message);
      console.error('Error finding championship by name:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchByName();
  }, [name]);

  return {
    championship,
    loading,
    error,
    refetch: searchByName
  };
} 