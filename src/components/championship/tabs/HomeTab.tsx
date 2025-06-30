import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Button } from "brk-design-system";
import { MapPin, Calendar, Clock, Video, UserPlus } from "lucide-react";

interface Season {
  id: string;
  name: string;
  slug?: string;
  startDate: string;
  endDate: string;
  championshipId: string;
  registrationOpen?: boolean;
}

interface HomeTabProps {
  championship: {
    name: string;
    description: string;
    kartodromo: string;
    longDescription: string;
    image?: string;
    avatar?: string;
    stats: Array<{ label: string; value: string }>;
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
    sponsors: Array<{
      id: string;
      name: string;
      logoImage: string;
      website?: string;
      type?: 'sponsor' | 'supporter';
    }>;
  };
  seasonsWithOpenRegistration?: Season[];
  onRegisterClick?: (seasonSlug: string) => void;
}

export const HomeTab = ({ 
  championship, 
  seasonsWithOpenRegistration = [], 
  onRegisterClick 
}: HomeTabProps) => {
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

  // Atualizar estados quando os dados do campeonato mudarem
  useEffect(() => {
    if (championship.availableSeasons && championship.availableSeasons.length > 0) {
      const firstSeason = championship.availableSeasons[0];
      const yearFromSeason = new Date(firstSeason.startDate).getUTCFullYear().toString();
      setSelectedYear(yearFromSeason);
      setSelectedSeason(firstSeason.name);
    }
  }, [championship.availableSeasons]);

  // Obter temporadas do ano selecionado
  const seasonsForYear = championship.availableSeasons 
    ? championship.availableSeasons.filter(season => 
        new Date(season.startDate).getUTCFullYear().toString() === selectedYear
      )
    : [];

  // Função para converter mês em número
  const getMonthNumber = (monthName: string): number => {
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

  // Filtrar eventos baseado na temporada selecionada e mostrar apenas futuros/em andamento
  const filteredEvents = championship.events
    .filter(_event => {
      if (!championship.availableSeasons) return true;
      
      const selectedSeasonData = championship.availableSeasons.find(season => season.name === selectedSeason);
      if (!selectedSeasonData) return true;
      
      // Aqui você pode adicionar lógica mais específica para filtrar eventos por temporada
      // Por enquanto, mostramos todos os eventos
      return true;
    })
    .filter(event => {
      // Filtrar apenas eventos em andamento ou futuros
      const now = new Date();
      const yearNum = parseInt(selectedYear);
      const monthNum = getMonthNumber(event.month);
      const dayNum = parseInt(event.date);
      const eventDate = new Date(yearNum, monthNum, dayNum);
      return eventDate >= now;
    })
    .sort((a, b) => {
      // Ordenar por data crescente
      const yearNum = parseInt(selectedYear);
      const monthA = getMonthNumber(a.month);
      const monthB = getMonthNumber(b.month);
      const dayA = parseInt(a.date);
      const dayB = parseInt(b.date);
      
      const dateA = new Date(yearNum, monthA, dayA);
      const dateB = new Date(yearNum, monthB, dayB);
      
      return dateA.getTime() - dateB.getTime();
    });

  // Separar patrocinadores e apoiadores
  const sponsors = championship.sponsors?.filter(s => s.type === 'sponsor' || !s.type) || [];
  const supporters = championship.sponsors?.filter(s => s.type === 'supporter') || [];

  return (
    <div className="space-y-8">
      {/* Seção Sobre - Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-dark-900 text-white w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden"
      >
        {/* Hero Section com imagem e informações */}
        <div className="relative min-h-[600px] flex items-center">
          {/* Imagem de fundo */}
          <div className="absolute inset-0">
            {championship.image && (
              <img 
                src={championship.image} 
                alt={championship.name}
                className="w-full h-full object-cover blur-md scale-125"
                onError={(e) => {
                  // Fallback para cor sólida se a imagem não carregar
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            {/* Overlay escuro para legibilidade */}
            <div className="absolute inset-0 bg-black/80"></div>
          </div>

          {/* Conteúdo principal */}
          <div className="relative z-10 container mx-auto py-8 px-4 grid md:grid-cols-2 gap-8 items-center h-full">
            {/* Lado esquerdo - Imagem do evento */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden md:flex justify-center"
            >
              <div className="w-full max-w-md">
                <img 
                  src={championship.image || championship.avatar || "/championship-placeholder.jpg"}
                  alt={`Imagem do ${championship.name}`}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    // Placeholder se imagem não carregar
                    const encodedName = encodeURIComponent(championship.name);
                    (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3E${encodedName}%3C/text%3E%3C/svg%3E`;
                  }}
                />
              </div>
            </motion.div>

            {/* Lado direito - Informações */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Badge dinâmico com nome do campeonato */}
              <div className="inline-block">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/30">
                  SOBRE {championship.name.toUpperCase()}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {championship.description}
              </h1>

              {/* Descrição */}
              <p className="text-lg text-white/80 leading-relaxed">
                {championship.longDescription}
              </p>

              {/* Botão CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="pt-4"
              >
                {seasonsWithOpenRegistration.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {seasonsWithOpenRegistration.map((season) => (
                      <Button
                        key={season.id}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full whitespace-normal text-center min-h-[48px] w-full sm:w-auto"
                        onClick={() => onRegisterClick?.(season.slug || season.id)}
                      >
                        <UserPlus className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span className="leading-tight">Inscrever-se em {season.name}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="bg-muted hover:bg-muted text-muted-foreground font-semibold px-8 py-3 rounded-full cursor-not-allowed whitespace-normal text-center min-h-[48px] w-full sm:w-auto"
                    disabled
                  >
                    <span className="leading-tight">Aguarde abertura das inscrições</span>
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Seção do Calendário */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container px-6 py-8"
      >
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold mb-2 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            CALENDÁRIO
          </h2>
          <h3 className="text-xl font-semibold text-muted-foreground">
            {championship.currentSeason.name}
          </h3>
        </div>

        {/* Filtros do Calendário */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium">Ano</label>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-full sm:min-w-32 px-4 py-2 rounded-lg border border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium">Temporada</label>
            <Select
              value={selectedSeason}
              onValueChange={setSelectedSeason}
            >
              <SelectTrigger className="w-full sm:min-w-40 px-4 py-2 rounded-lg border border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seasonsForYear.length > 0 ? (
                  seasonsForYear.map(season => (
                    <SelectItem key={season.id} value={season.name}>{season.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value={championship.currentSeason.season}>{championship.currentSeason.season}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
              >
                <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* Data */}
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold">{event.date}</div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {event.month}
                      </div>
                    </div>

                    {/* Informações do evento */}
                    <div className="space-y-2">
                      <div className="font-medium text-sm">{event.day}</div>
                      <div className="font-bold">{event.stage}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(event.time)}
                      </div>
                      {event.streamLink && (
                        <div className="text-sm text-primary flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          <a 
                            href={event.streamLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Transmissão
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3">
                      <Badge 
                        variant={event.status === "Inscrição Aberta" ? "default" : "secondary"}
                        className={`w-full justify-center text-xs ${
                          event.status === "Inscrição Aberta" 
                            ? "bg-primary text-white" 
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Nenhuma etapa encontrada para os filtros selecionados.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Seção dos Patrocinadores e Apoiadores - só exibe se houver patrocinadores */}
      {championship.sponsors && Array.isArray(championship.sponsors) && championship.sponsors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="container px-6 py-8"
        >
          {/* Seção dos Patrocinadores */}
          {sponsors.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-3xl font-bold mb-8 text-center">
                Patrocinadores
              </h2>
              
              {/* Grid dos Patrocinadores - Tamanho maior para mais relevância */}
              <div className="flex flex-wrap justify-center items-center gap-8">
                {sponsors.map((sponsor, index) => (
                  <motion.div
                    key={sponsor.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 + (index * 0.05) }}
                    className="w-[220px] h-80" // Tamanho maior para patrocinadores
                  >
                    {sponsor.website ? (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full p-4 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer border-2 border-primary/20 hover:border-primary/40"
                        title={`Visitar site de ${sponsor.name}`}
                      >
                        <img
                          src={sponsor.logoImage}
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain opacity-100 hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            // Placeholder se imagem não carregar
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12' font-family='Arial'%3E${encodeURIComponent(sponsor.name.slice(0, 2).toUpperCase())}%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </a>
                    ) : (
                      <div className="w-full h-full p-4 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors border-2 border-primary/20 hover:border-primary/40">
                        <img
                          src={sponsor.logoImage}
                          alt={sponsor.name}
                          className="max-w-full max-h-full object-contain opacity-100 hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            // Placeholder se imagem não carregar
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12' font-family='Arial'%3E${encodeURIComponent(sponsor.name.slice(0, 2).toUpperCase())}%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Seção dos Apoiadores */}
          {supporters.length > 0 && (
            <div>
              <h3 className="font-heading text-xl font-semibold mb-6 text-center text-muted-foreground">
                Apoiadores
              </h3>
              
              {/* Grid dos Apoiadores - Tamanho menor */}
              <div className="flex flex-wrap justify-center items-center gap-6">
                {supporters.map((supporter, index) => (
                  <motion.div
                    key={supporter.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.0 + (index * 0.03) }}
                    className="w-[140px] h-48" // Tamanho menor para apoiadores
                  >
                    {supporter.website ? (
                      <a
                        href={supporter.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full p-2 rounded-lg flex items-center justify-center hover:bg-muted/30 transition-colors cursor-pointer border border-muted/30 hover:border-muted/50"
                        title={`Visitar site de ${supporter.name}`}
                      >
                        <img
                          src={supporter.logoImage}
                          alt={supporter.name}
                          className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            // Placeholder se imagem não carregar
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='8' font-family='Arial'%3E${encodeURIComponent(supporter.name.slice(0, 2).toUpperCase())}%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </a>
                    ) : (
                      <div className="w-full h-full p-2 rounded-lg flex items-center justify-center hover:bg-muted/30 transition-colors border border-muted/30 hover:border-muted/50">
                        <img
                          src={supporter.logoImage}
                          alt={supporter.name}
                          className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            // Placeholder se imagem não carregar
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='8' font-family='Arial'%3E${encodeURIComponent(supporter.name.slice(0, 2).toUpperCase())}%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Mensagem caso não haja nenhum patrocinador ou apoiador */}
          {sponsors.length === 0 && supporters.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum patrocinador ou apoiador cadastrado ainda.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}; 