import { useState, useEffect } from 'react';
import { championshipService, RaceTrack } from '../services/championship.service';

export const useRaceTracks = () => {
  const [raceTracks, setRaceTracks] = useState<RaceTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaceTracks = async () => {
      try {
        setLoading(true);
        const data = await championshipService.getAllRaceTracks();
        setRaceTracks(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar kartódromos');
        console.error('Error fetching race tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRaceTracks();
  }, []);

  const getRaceTrackById = (id: string): RaceTrack | null => {
    return raceTracks.find(raceTrack => raceTrack.id === id) || null;
  };

  const getActiveRaceTracks = (): RaceTrack[] => {
    return raceTracks.filter(raceTrack => raceTrack.isActive);
  };

  return {
    raceTracks,
    loading,
    error,
    getRaceTrackById,
    getActiveRaceTracks,
    refetch: () => {
      setLoading(true);
      championshipService.getAllRaceTracks()
        .then(data => {
          setRaceTracks(data);
          setError(null);
        })
        .catch(err => {
          setError('Erro ao recarregar kartódromos');
          console.error('Error refetching race tracks:', err);
        })
        .finally(() => setLoading(false));
    }
  };
}; 