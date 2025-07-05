import { MapPin } from "lucide-react";
import { RaceTrack } from "@/services/championship.service";

interface RaceTrackInfoProps {
  raceTrack?: RaceTrack;
  raceTrackId?: string;
  raceTracks?: RaceTrack[];
  showAddress?: boolean;
  className?: string;
}

export const RaceTrackInfo = ({ 
  raceTrack, 
  raceTrackId, 
  raceTracks = [], 
  showAddress = false,
  className = "" 
}: RaceTrackInfoProps) => {
  // Função para obter dados do kartódromo
  const getRaceTrackData = (): RaceTrack | null => {
    if (raceTrack) return raceTrack;
    if (raceTrackId) {
      return raceTracks.find(rt => rt.id === raceTrackId) || null;
    }
    return null;
  };

  const raceTrackData = getRaceTrackData();

  if (!raceTrackData) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Kartódromo não disponível</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-col">
        <span>{raceTrackData.name}</span>
        {showAddress && (
          <span className="text-sm text-muted-foreground">{raceTrackData.address}</span>
        )}
      </div>
    </div>
  );
}; 