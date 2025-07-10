import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Button } from "brk-design-system";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "brk-design-system";
import { MapPin, Clock, Calendar, ChevronRight, Video, X } from "lucide-react";
import { RaceTrack } from "@/services/championship.service";
import { RaceTrackInfo } from "@/components/championship/RaceTrackInfo";
import { ChampionshipTabHeader } from "@/components/championship/ChampionshipTabHeader";

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
      location: string; // Agora é raceTrackId
      time: string;
      status: string;
      streamLink?: string;
      briefing?: string;
      raceTrackData?: RaceTrack; // Dados do kartódromo já incluídos
      trackLayout?: any; // Dados do traçado se disponível
    }>;
  };
  onRegisterClick?: (seasonSlug: string) => void;
}

export const CalendarioTab = ({ championship, onRegisterClick }: CalendarioTabProps) => {
  // Estado para controlar o modal de detalhes
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determinar ano inicial baseado nas temporadas disponíveis
  const getInitialYear = () => {
    if (championship?.availableSeasons && championship.availableSeasons.length > 0) {
      return new Date(championship.availableSeasons[0].startDate).getUTCFullYear().toString();
    }
    return championship?.currentSeason?.year || new Date().getFullYear().toString();
  };

  // Determinar temporada inicial baseada nas temporadas disponíveis
  const getInitialSeason = () => {
    if (championship?.availableSeasons && championship.availableSeasons.length > 0) {
      return championship.availableSeasons[0].name;
    }
    return championship?.currentSeason?.season || '';
  };

  const [selectedYear, setSelectedYear] = useState<string>(getInitialYear());
  const [selectedSeason, setSelectedSeason] = useState<string>(getInitialSeason());

  // Função para abrir detalhes da etapa
  const handleOpenEventDetails = (event: any) => {
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Obter anos únicos das temporadas disponíveis
  const availableYears = championship?.availableSeasons 
    ? [...new Set(championship.availableSeasons.map(season => 
        new Date(season.startDate).getUTCFullYear().toString()
      ))].sort()
    : [championship?.currentSeason?.year || new Date().getFullYear().toString()];

  // Obter temporadas do ano selecionado
  const seasonsForYear = championship?.availableSeasons 
    ? championship.availableSeasons.filter(season => 
        new Date(season.startDate).getUTCFullYear().toString() === selectedYear
      )
    : [];

  // Atualizar estados quando os dados do campeonato mudarem
  useEffect(() => {
    if (championship?.availableSeasons && championship.availableSeasons.length > 0) {
      const firstSeason = championship.availableSeasons[0];
      const yearFromSeason = new Date(firstSeason.startDate).getUTCFullYear().toString();
      setSelectedYear(yearFromSeason);
      setSelectedSeason(firstSeason.name);
    }
  }, [championship?.availableSeasons]);

  // Função para converter mês em número
  const getMonthNumber = (monthName: string): number => {
    if (!monthName || typeof monthName !== 'string') return 0;
    
    const months: { [key: string]: number } = {
      'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
      'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11,
      'JANEIRO': 0, 'FEVEREIRO': 1, 'MARÇO': 2, 'ABRIL': 3, 'MAIO': 4, 'JUNHO': 5,
      'JULHO': 6, 'AGOSTO': 7, 'SETEMBRO': 8, 'OUTUBRO': 9, 'NOVEMBRO': 10, 'DEZEMBRO': 11
    };
    return months[monthName.toUpperCase()] || 0;
  };

  // Função para formatar hora no formato HH:mm
  const formatTime = (time: string): string => {
    if (!time || typeof time !== 'string') return '';
    
    // Se estiver no formato HH:mm:ss, remove os segundos
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.slice(0, 5); // Pega apenas HH:mm
    }
    
    // Se estiver no formato H:mm:ss, remove os segundos e adiciona zero à esquerda
    if (/^\d{1}:\d{2}:\d{2}$/.test(time)) {
      return `0${time.slice(0, 4)}`; // Pega H:mm e adiciona zero
    }
    
    // Se já estiver no formato HH:mm, retorna como está
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }
    
    // Se estiver no formato H:mm, adiciona zero à esquerda
    if (/^\d{1}:\d{2}$/.test(time)) {
      return `0${time}`;
    }
    
    // Se for apenas números (ex: 1400), converte para HH:mm
    if (/^\d{3,4}$/.test(time)) {
      const hours = time.length === 3 ? time.slice(0, 1) : time.slice(0, 2);
      const minutes = time.length === 3 ? time.slice(1) : time.slice(2);
      return `${hours.padStart(2, '0')}:${minutes}`;
    }
    
    // Caso padrão, retorna como está
    return time;
  };

  // Filtrar e ordenar todos os eventos por data crescente
  const filteredEvents = (championship?.events || [])
    .filter(_event => {
      if (!championship?.availableSeasons) return true;
      
      const selectedSeasonData = championship.availableSeasons.find(season => season.name === selectedSeason);
      if (!selectedSeasonData) return true;
      
      // Aqui você pode adicionar lógica mais específica para filtrar eventos por temporada
      // Por enquanto, mostramos todos os eventos
      return true;
    })
    .sort((a, b) => {
      // Criar datas mais precisas para ordenação
      const yearNum = parseInt(selectedYear) || new Date().getFullYear();
      const monthA = getMonthNumber(a.month);
      const monthB = getMonthNumber(b.month);
      const dayA = parseInt(a.date) || 1;
      const dayB = parseInt(b.date) || 1;
      
      const dateA = new Date(yearNum, monthA, dayA);
      const dateB = new Date(yearNum, monthB, dayB);
      
      return dateA.getTime() - dateB.getTime();
    });

  // Verificar se há dados válidos
  if (!championship) {
    return (
      <div className="space-y-8">
        <ChampionshipTabHeader
          icon={Calendar}
          title="Calendário do Campeonato"
          description="Acompanhe todas as etapas e datas importantes do campeonato"
        />
        <div className="container px-6">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dados não disponíveis</h3>
            <p className="text-muted-foreground">
              Os dados do campeonato não estão disponíveis no momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <ChampionshipTabHeader
        icon={Calendar}
        title="Calendário do Campeonato"
        description={`Acompanhe todas as etapas e datas importantes do ${championship.currentSeason?.name || 'campeonato'}`}
      />

      <div className="container px-6 space-y-6">

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium">Ano</label>
          <Select value={selectedYear} onValueChange={(value) => setSelectedYear(value)}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium">Temporada</label>
          <Select value={selectedSeason} onValueChange={(value) => setSelectedSeason(value)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Temporada" />
            </SelectTrigger>
            <SelectContent>
              {seasonsForYear.length > 0 ? (
                seasonsForYear.map((season) => (
                  <SelectItem key={season.id} value={season.name}>
                    {season.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={championship.currentSeason?.season || ''}>
                  {championship.currentSeason?.season || 'Temporada atual'}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
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
                      <RaceTrackInfo 
                        raceTrack={event.raceTrackData}
                        className="flex items-center gap-2"
                      />
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(event.time)}</span>
                      </div>
                      {event.trackLayout && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Traçado: {event.trackLayout.name}</span>
                        </div>
                      )}
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
                    {event.status === "Inscrição Aberta" ? (
                      <Button 
                        variant="default"
                        size="sm"
                        className="w-full md:w-auto whitespace-normal text-center min-h-[36px]"
                        onClick={() => onRegisterClick?.(selectedSeason)}
                      >
                        <span className="leading-tight">Inscrever-se</span>
                        <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full md:w-auto whitespace-normal text-center min-h-[36px]"
                        onClick={() => handleOpenEventDetails(event)}
                      >
                        <span className="leading-tight">Ver Detalhes</span>
                        <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
                      </Button>
                    )}
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

      {/* Modal de Detalhes da Etapa */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Detalhes da Etapa
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCloseModal}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Cabeçalho da etapa */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-primary/5 rounded-lg">
                    <div className="bg-primary/10 rounded-lg p-4 text-center min-w-20">
                      <div className="text-2xl font-bold text-primary">{selectedEvent.date}</div>
                      <div className="text-sm text-muted-foreground uppercase font-medium">
                        {selectedEvent.month}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2">{selectedEvent.stage}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge 
                          variant={selectedEvent.status === "Inscrição Aberta" ? "default" : "secondary"}
                          className={
                            selectedEvent.status === "Inscrição Aberta" 
                              ? "bg-primary text-white" 
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {selectedEvent.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{selectedEvent.day}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informações detalhadas */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Local</h4>
                          <RaceTrackInfo 
                            raceTrack={selectedEvent.raceTrackData}
                            showAddress={true}
                            className="p-0"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Horário</h4>
                          <p className="text-muted-foreground">{formatTime(selectedEvent.time)}</p>
                        </div>
                      </div>

                      {selectedEvent.trackLayout && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-semibold">Traçado</h4>
                            <p className="text-muted-foreground">{selectedEvent.trackLayout.name}</p>
                            {selectedEvent.trackLayout.description && (
                              <p className="text-sm text-muted-foreground mt-1">{selectedEvent.trackLayout.description}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedEvent.streamLink && (
                        <div className="flex items-start gap-3">
                          <Video className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-semibold">Transmissão</h4>
                            <a 
                              href={selectedEvent.streamLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Assistir ao vivo
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Briefing da Etapa - Mobile/Desktop */}
                      {selectedEvent.briefing && (
                        <div className="lg:hidden">
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-start gap-2">
                              <Calendar className="h-5 w-5 text-primary mt-0.5" />
                              Briefing da Etapa
                            </h4>
                            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {selectedEvent.briefing}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Briefing da Etapa - Desktop lateral */}
                      {selectedEvent.briefing && (
                        <div className="hidden lg:block">
                          <div className="p-4 bg-muted/30 rounded-lg h-fit">
                            <h4 className="font-semibold mb-3 flex items-start gap-2">
                              <Calendar className="h-5 w-5 text-primary mt-0.5" />
                              Briefing da Etapa
                            </h4>
                            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {selectedEvent.briefing}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedEvent.status === "Inscrição Aberta" && (
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <h4 className="font-semibold mb-2 text-primary">Inscrições Abertas!</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Garante já sua vaga nesta etapa emocionante.
                          </p>
                          <Button 
                            className="w-full whitespace-normal text-center min-h-[40px]"
                            onClick={() => onRegisterClick?.(selectedSeason)}
                          >
                            <span className="leading-tight">Inscrever-se Agora</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rodapé com ações */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={handleCloseModal}>
                      Fechar
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}; 