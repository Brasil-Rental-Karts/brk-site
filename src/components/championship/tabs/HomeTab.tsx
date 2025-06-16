import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Button } from "brk-design-system";
import { MapPin, Calendar, Clock } from "lucide-react";

interface HomeTabProps {
  championship: {
    name: string;
    description: string;
    kartodromo: string;
    longDescription: string;
    stats: Array<{ label: string; value: string }>;
    currentSeason: {
      name: string;
      year: string;
      season: string;
    };
    events: Array<{
      id: number;
      date: string;
      month: string;
      day: string;
      stage: string;
      location: string;
      time: string;
      status: string;
    }>;
    sponsors: Array<{
      id: number;
      name: string;
      logo: string;
    }>;
  };
}

export const HomeTab = ({ championship }: HomeTabProps) => {
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
        <div className="relative h-[600px] flex items-center">
          {/* Imagem de fundo */}
          <div className="absolute inset-0">
            <img 
              src="/championship-hero-image.jpg" 
              alt="Escola da Velocidade"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback para cor sólida se a imagem não carregar
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Overlay escuro para legibilidade */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Conteúdo principal */}
          <div className="relative z-10 container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center h-full">
            {/* Lado esquerdo - Imagem do evento */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden md:flex justify-center"
            >
              <div className="w-full max-w-md">
                <img 
                  src="/escola-velocidade-main.jpg"
                  alt="Pilotos da Escola da Velocidade"
                  className="w-full h-auto rounded-lg shadow-2xl"
                  onError={(e) => {
                    // Placeholder se imagem não carregar
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3EEscola da Velocidade%3C/text%3E%3C/svg%3E";
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
              {/* Badge "Sobre a Escola da Velocidade" */}
              <div className="inline-block">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/30">
                  SOBRE A ESCOLA DA VELOCIDADE
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

              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {championship.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-white/70 font-medium tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Botão CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="pt-4"
              >
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full"
                >
                  Fazer Inscrição
                </Button>
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
        className="px-6 py-8"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            CALENDÁRIO
          </h2>
          <h3 className="text-xl font-semibold text-muted-foreground">
            {championship.currentSeason.name}
          </h3>
        </div>

        {/* Filtros do Calendário */}
        <div className="flex gap-4 mb-6">
          <select className="px-4 py-2 rounded-lg border border-border bg-background">
            <option value="2025">{championship.currentSeason.year}</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-border bg-background">
            <option value="temporada1">{championship.currentSeason.season}</option>
          </select>
        </div>

        {/* Grid de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {championship.events.map((event, index) => (
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
                      {event.time}
                    </div>
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
          ))}
        </div>
      </motion.div>

      {/* Seção dos Patrocinadores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="px-6 py-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Patrocinadores
        </h2>

        {/* Grid dos Patrocinadores */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {championship.sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + (index * 0.05) }}
              className="aspect-square bg-muted/30 rounded-lg p-4 flex items-center justify-center hover:bg-muted/50 transition-colors"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="max-w-full max-h-full object-contain opacity-70"
                onError={(e) => {
                  // Placeholder se imagem não carregar
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='10' font-family='Arial'%3ESP%3C/text%3E%3C/svg%3E";
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}; 