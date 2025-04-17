import { useClub } from "@/contexts/ClubContext"
import { motion } from "framer-motion"
import { useParams, Navigate } from "react-router-dom"
import { CLUBS } from "@/contexts/ClubContext"
import { CalendarDays, Trophy, Users, Medal, MapPin, Phone, Mail, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const EVENTS = [
  {
    id: 1,
    title: "Treino Livre",
    date: "27/03/2024",
    time: "19:00",
    type: "Treino",
    status: "Inscrições Abertas",
    participants: 12,
    maxParticipants: 20
  },
  {
    id: 2,
    title: "4ª Etapa - Campeonato Light",
    date: "30/03/2024",
    time: "14:00",
    type: "Corrida",
    status: "Inscrições Abertas",
    participants: 18,
    maxParticipants: 24
  },
  {
    id: 3,
    title: "3ª Etapa - Campeonato Pro",
    date: "06/04/2024",
    time: "19:00",
    type: "Corrida",
    status: "Em Breve",
    participants: 0,
    maxParticipants: 24
  }
]

const CHAMPIONSHIPS = [
  {
    id: 1,
    title: "Campeonato Light 2024",
    totalRaces: 8,
    currentRace: 3,
    participants: 24,
    nextRace: "30/03/2024",
    status: "Em Andamento"
  },
  {
    id: 2,
    title: "Campeonato Pro 2024",
    totalRaces: 8,
    currentRace: 2,
    participants: 24,
    nextRace: "06/04/2024",
    status: "Em Andamento"
  }
]

const RANKING = [
  {
    position: 1,
    name: "Lucas Silva",
    points: 245,
    wins: 4,
    podiums: 8,
    lastRace: "2º lugar",
    category: "Pro"
  },
  {
    position: 2,
    name: "Pedro Santos",
    points: 232,
    wins: 3,
    podiums: 7,
    lastRace: "1º lugar",
    category: "Pro"
  },
  {
    position: 3,
    name: "Gabriel Costa",
    points: 218,
    wins: 2,
    podiums: 6,
    lastRace: "3º lugar",
    category: "Pro"
  },
  {
    position: 4,
    name: "Matheus Oliveira",
    points: 205,
    wins: 2,
    podiums: 5,
    lastRace: "4º lugar",
    category: "Pro"
  },
  {
    position: 5,
    name: "João Paulo",
    points: 198,
    wins: 1,
    podiums: 5,
    lastRace: "5º lugar",
    category: "Pro"
  }
]

const CLUB_INFO = {
  "start-racing-livens": {
    description: "O Start Racing Livens é uma organização dedicada à gestão e promoção de campeonatos de kart amador e profissional. Nossa missão é proporcionar uma experiência competitiva e organizada para pilotos de todos os níveis, com eventos bem estruturados e um sistema de pontuação justo.",
    location: {
      city: "Penha",
      state: "SC",
      region: "Vale do Itajaí"
    },
    contact: {
      phone: "(47) 99999-9999",
      email: "contato@startracinglivens.com.br",
      website: "www.startracinglivens.com.br"
    },
    championships: {
      current: 2,
      total: 5,
      categories: ["Light", "Pro"],
      averageParticipants: 24
    },
    history: {
      founded: 2020,
      totalEvents: 25,
      totalPilots: 150
    }
  }
}

export function Club() {
  const { alias } = useParams()
  const { selectedClub, selectClub } = useClub()
  
  if (!selectedClub) {
    const club = CLUBS.find(c => c.alias === alias)
    if (!club) return <Navigate to="/" />
    selectClub(club)
    return null
  }

  const clubInfo = CLUB_INFO[selectedClub.alias as keyof typeof CLUB_INFO]

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-700"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container px-8 py-16"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold mb-8"
        >
          {selectedClub.name}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CalendarDays className="h-6 w-6 text-primary-500" />
                Próximos Eventos
              </h2>
              <div className="space-y-4">
                {EVENTS.map(event => (
                  <div key={event.id} className="bg-muted/50 rounded-lg p-4 hover:bg-muted/70 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        event.status === "Inscrições Abertas" 
                          ? "bg-primary-500/10 text-primary-500"
                          : "bg-muted-foreground/10 text-muted-foreground"
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <p>{event.date} às {event.time}</p>
                      <p className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.participants}/{event.maxParticipants} pilotos
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={event.status === "Inscrições Abertas" ? "default" : "outline"}
                      className="w-full"
                      disabled={event.status !== "Inscrições Abertas"}
                    >
                      Inscrever-se
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary-500" />
                Campeonatos Ativos
              </h2>
              <div className="space-y-4">
                {CHAMPIONSHIPS.map(championship => (
                  <div key={championship.id} className="bg-muted/50 rounded-lg p-4 hover:bg-muted/70 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{championship.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-500/10 text-primary-500">
                        {championship.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <p>Etapa {championship.currentRace} de {championship.totalRaces}</p>
                      <p>Próxima etapa: {championship.nextRace}</p>
                      <p className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {championship.participants} pilotos
                      </p>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline" 
                      className="w-full"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Medal className="h-6 w-6 text-primary-500" />
                Ranking do Clube
              </h2>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="space-y-4">
                  {RANKING.map((pilot) => (
                    <div 
                      key={pilot.position}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-lg font-bold ${getPositionColor(pilot.position)}`}>
                          #{pilot.position}
                        </span>
                        <div>
                          <h3 className="font-medium">{pilot.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pilot.category} • {pilot.wins} vitórias • {pilot.podiums} pódios
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary-500">{pilot.points} pts</span>
                        <p className="text-sm text-muted-foreground">Última: {pilot.lastRace}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                >
                  Ver Ranking Completo
                </Button>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary-500" />
                Sobre o Clube
              </h2>
              <div className="bg-muted/50 rounded-lg p-6 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {clubInfo.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Localização</h3>
                    <p className="text-sm text-muted-foreground">
                      {clubInfo.location.city} - {clubInfo.location.state}<br />
                      Região: {clubInfo.location.region}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Campeonatos</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Campeonatos Ativos: {clubInfo.championships.current}</p>
                      <p>Total de Campeonatos: {clubInfo.championships.total}</p>
                      <p>Categorias: {clubInfo.championships.categories.join(", ")}</p>
                      <p>Média de Participantes: {clubInfo.championships.averageParticipants} pilotos</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">História</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Fundado em: {clubInfo.history.founded}</p>
                      <p>Total de Eventos: {clubInfo.history.totalEvents}</p>
                      <p>Total de Pilotos: {clubInfo.history.totalPilots}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Contato</h3>
                    <div className="space-y-2">
                      <a 
                        href={`tel:${clubInfo.contact.phone}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-500 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {clubInfo.contact.phone}
                      </a>
                      <a 
                        href={`mailto:${clubInfo.contact.email}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-500 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {clubInfo.contact.email}
                      </a>
                      <a 
                        href={`https://${clubInfo.contact.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-500 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4" />
                        {clubInfo.contact.website}
                      </a>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Seja um Parceiro
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
} 