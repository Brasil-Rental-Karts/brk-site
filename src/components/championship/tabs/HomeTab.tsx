import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { MapPin, Calendar, Clock } from "lucide-react";

interface HomeTabProps {
  championship: {
    name: string;
    description: string;
    kartodromo: string;
    longDescription: string;
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
      {/* Seção do Calendário */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
        transition={{ duration: 0.5, delay: 0.4 }}
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
              transition={{ duration: 0.3, delay: 0.5 + (index * 0.05) }}
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