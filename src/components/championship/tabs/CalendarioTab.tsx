import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Button } from "brk-design-system";
import { MapPin, Clock, Calendar, ChevronRight, Video } from "lucide-react";

interface CalendarioTabProps {
  championship: {
    currentSeason: {
      name: string;
      year: string;
      season: string;
    };
    availableSeasons?: Array<{
      id: string;
      name: string;
      startDate: string;
      endDate: string;
      championshipId: string;
    }>;
    events: Array<{
      id: number;
      date: string;
      month: string;
      day: string;
      stage: string;
      location: string;
      time: string;
      status: string;
      streamLink?: string;
    }>;
  };
}

export const CalendarioTab = ({ championship }: CalendarioTabProps) => {
  // Determinar ano inicial baseado nas temporadas disponíveis
  const getInitialYear = () => {
    if (championship.availableSeasons && championship.availableSeasons.length > 0) {
      return new Date(championship.availableSeasons[0].startDate).getUTCFullYear().toString();
    }
    return championship.currentSeason.year;
  };

  // Determinar temporada inicial baseada nas temporadas disponíveis
  const getInitialSeason = () => {
    if (championship.availableSeasons && championship.availableSeasons.length > 0) {
      return championship.availableSeasons[0].name;
    }
    return championship.currentSeason.season;
  };

  const [selectedYear, setSelectedYear] = useState<string>(getInitialYear());
  const [selectedSeason, setSelectedSeason] = useState<string>(getInitialSeason());

  // Obter anos únicos das temporadas disponíveis
  const availableYears = championship.availableSeasons 
    ? [...new Set(championship.availableSeasons.map(season => 
        new Date(season.startDate).getUTCFullYear().toString()
      ))].sort()
    : [championship.currentSeason.year];

  // Obter temporadas do ano selecionado
  const seasonsForYear = championship.availableSeasons 
    ? championship.availableSeasons.filter(season => 
        new Date(season.startDate).getUTCFullYear().toString() === selectedYear
      )
    : [];

  // Atualizar estados quando os dados do campeonato mudarem
  useEffect(() => {
    if (championship.availableSeasons && championship.availableSeasons.length > 0) {
      const firstSeason = championship.availableSeasons[0];
      const yearFromSeason = new Date(firstSeason.startDate).getUTCFullYear().toString();
      setSelectedYear(yearFromSeason);
      setSelectedSeason(firstSeason.name);
    }
  }, [championship.availableSeasons]);

  // Filtrar eventos baseado na temporada selecionada
  const filteredEvents = championship.events.filter(event => {
    if (!championship.availableSeasons) return true;
    
    const selectedSeasonData = championship.availableSeasons.find(season => season.name === selectedSeason);
    if (!selectedSeasonData) return true;
    
    // Aqui você pode adicionar lógica mais específica para filtrar eventos por temporada
    // Por enquanto, mostramos todos os eventos
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          Calendário do Campeonato
        </h1>
        <p className="text-muted-foreground mb-6">
          Acompanhe todas as etapas e datas importantes do {championship.currentSeason.name}
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Ano</label>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background min-w-32"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Temporada</label>
          <select 
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background min-w-40"
          >
            {seasonsForYear.length > 0 ? (
              seasonsForYear.map(season => (
                <option key={season.id} value={season.name}>{season.name}</option>
              ))
            ) : (
              <option value={championship.currentSeason.season}>{championship.currentSeason.season}</option>
            )}
          </select>
        </div>
      </motion.div>

      {/* Lista de Eventos - Layout de Lista */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Data */}
                  <div className="flex-shrink-0">
                    <div className="bg-primary/10 rounded-lg p-4 text-center min-w-20">
                      <div className="text-2xl font-bold text-primary">{event.date}</div>
                      <div className="text-sm text-muted-foreground uppercase font-medium">
                        {event.month}
                      </div>
                    </div>
                  </div>

                  {/* Informações principais */}
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-xl font-bold">{event.stage}</h3>
                      <Badge 
                        variant={event.status === "Inscrição Aberta" ? "default" : "secondary"}
                        className={`w-fit ${
                          event.status === "Inscrição Aberta" 
                            ? "bg-primary text-white" 
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">{event.day}</div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      {event.streamLink && (
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={event.streamLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Assistir transmissão
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ação */}
                  <div className="flex-shrink-0">
                    <Button 
                      variant={event.status === "Inscrição Aberta" ? "default" : "outline"}
                      size="sm"
                      className="w-full md:w-auto"
                      disabled={event.status !== "Inscrição Aberta"}
                    >
                      {event.status === "Inscrição Aberta" ? "Inscrever-se" : "Ver Detalhes"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                      </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma etapa encontrada para os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Informações adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 p-4 bg-muted/30 rounded-lg"
      >
        <h3 className="font-semibold mb-2">Informações Importantes:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• As inscrições para cada etapa abrem com antecedência</li>
          <li>• Confirmem sempre a data e horário antes de cada evento</li>
          <li>• Em caso de chuva, consulte as redes sociais para atualizações</li>
        </ul>
      </motion.div>
    </div>
  );
}; 