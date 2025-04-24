import { useClub } from "@/contexts/ClubContext"
import { motion } from "framer-motion"
import { useParams, Navigate, Link } from "react-router-dom"
import { CLUBS } from "@/contexts/ClubContext"
import { CalendarDays, Trophy, Users, Medal, MapPin, Phone, Mail, Link as LinkIcon, Hash, Shield, Flag, Award, AlertTriangle, Scale, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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

const RANKING = [
  // Pro Category
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
  },
  // Light Category
  {
    position: 1,
    name: "Rafael Mendes",
    points: 212,
    wins: 3,
    podiums: 7,
    lastRace: "1º lugar",
    category: "Light"
  },
  {
    position: 2,
    name: "Bruno Carvalho",
    points: 195,
    wins: 2,
    podiums: 6,
    lastRace: "3º lugar",
    category: "Light"
  },
  {
    position: 3,
    name: "Henrique Almeida",
    points: 187,
    wins: 2,
    podiums: 5,
    lastRace: "2º lugar",
    category: "Light"
  },
  {
    position: 4,
    name: "Thiago Martins",
    points: 165,
    wins: 1,
    podiums: 4,
    lastRace: "4º lugar",
    category: "Light"
  },
  {
    position: 5,
    name: "Gustavo Lima",
    points: 152,
    wins: 1,
    podiums: 3,
    lastRace: "5º lugar",
    category: "Light"
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

// Add sponsors data
const SPONSORS = [
  {
    id: 1,
    name: "KartSpeed Motors",
    logo: "https://placehold.co/200x100/252525/FFF?text=KartSpeed",
    website: "https://example.com/kartspeeds",
    type: "Principal"
  },
  {
    id: 2,
    name: "RaceGear Pro",
    logo: "https://placehold.co/200x100/252525/FFF?text=RaceGear",
    website: "https://example.com/racegear",
    type: "Oficial"
  },
  {
    id: 3,
    name: "Pit Stop Combustíveis",
    logo: "https://placehold.co/200x100/252525/FFF?text=PitStop",
    website: "https://example.com/pitstop",
    type: "Apoio"
  },
  {
    id: 4,
    name: "Veloce Parts",
    logo: "https://placehold.co/200x100/252525/FFF?text=Veloce",
    website: "https://example.com/veloce",
    type: "Apoio"
  }
]

// Make this interface exportable
export interface ClubProps {
  section?: 'calendario' | 'classificacao' | 'regulamento';
}

// Regulation sections with content
const regulationSections = [
  {
    id: "inscricao",
    title: "Inscrição e Participação",
    icon: <Shield className="h-5 w-5" />,
    content: [
      "As inscrições devem ser realizadas pelo site oficial com pelo menos 24 horas de antecedência ao evento.",
      "O piloto deve estar em dia com a taxa de associação ao clube.",
      "Pilotos menores de 18 anos precisam de autorização dos responsáveis legais.",
      "Cada piloto é responsável por verificar seu equipamento de segurança antes do evento.",
      "É obrigatório o uso de capacete, luvas e macacão durante as competições."
    ]
  },
  {
    id: "categorias",
    title: "Categorias",
    icon: <Flag className="h-5 w-5" />,
    content: [
      "<strong>Light:</strong> Para pilotos iniciantes e intermediários, com experiência inferior a 2 anos em competições oficiais.",
      "<strong>Pro:</strong> Para pilotos com experiência comprovada em competições anteriores, incluindo pódios em campeonatos regionais.",
      "A direção de prova pode solicitar a mudança de categoria caso o desempenho do piloto esteja incompatível com sua categoria atual.",
      "Pilotos estreantes iniciam obrigatoriamente na categoria Light, com possibilidade de promoção após completar um campeonato completo."
    ]
  },
  {
    id: "formato",
    title: "Formato das Corridas",
    icon: <Hash className="h-5 w-5" />,
    content: [
      "Todos os eventos contam com tomada de tempo (15 minutos) e corrida principal (duração variável conforme a etapa).",
      "O grid de largada é definido pelo resultado da tomada de tempo.",
      "A quantidade de voltas varia de acordo com o evento e é informada no briefing, tipicamente entre 15 e 25 voltas.",
      "Em caso de chuva, a direção de prova pode alterar a duração ou formato da corrida, priorizando a segurança dos pilotos.",
      "As largadas são realizadas em movimento, com os karts alinhados em duas filas."
    ]
  },
  {
    id: "pontuacao",
    title: "Pontuação e Classificação",
    icon: <Award className="h-5 w-5" />,
    content: [
      "1º lugar: 35 pontos",
      "2º lugar: 30 pontos",
      "3º lugar: 27 pontos",
      "4º lugar: 25 pontos",
      "5º lugar: 23 pontos",
      "Do 6º ao 20º lugar: pontuação decrescente (22, 21, 20...)",
      "Volta mais rápida: 1 ponto adicional",
      "Pole position: 1 ponto adicional",
      "Para a classificação final do campeonato, descarta-se o pior resultado do piloto ao longo da temporada.",
      "Em caso de empate na pontuação final, o desempate será feito por: 1) Número de vitórias; 2) Número de segundos lugares; 3) Número de poles."
    ]
  },
  {
    id: "penalidades",
    title: "Penalidades",
    icon: <AlertTriangle className="h-5 w-5" />,
    content: [
      "Advertência: para infrações leves, sem consequências para outros competidores.",
      "Drive-through: o piloto deverá passar pelos boxes sem parar, respeitando o limite de velocidade.",
      "Stop and Go: o piloto deverá parar na área de box por 10 segundos e depois retornar à pista.",
      "Exclusão da prova: em casos de conduta antidesportiva grave ou reincidência.",
      "As penalidades são aplicadas pelos comissários de prova e são inapeláveis.",
      "Contatos que resultem em vantagem indevida ou prejudiquem outro competidor serão penalizados.",
      "Manobras de defesa com mudança de direção na freada serão penalizadas."
    ]
  },
  {
    id: "equipamentos",
    title: "Equipamentos e Segurança",
    icon: <Scale className="h-5 w-5" />,
    content: [
      "Todos os karts são sorteados antes da tomada de tempo para garantir igualdade de condições.",
      "É permitido ajuste de banco e pedais, mas não são permitidas modificações nos karts.",
      "O peso mínimo do conjunto piloto+kart é de 180kg para todas as categorias.",
      "Pilotos abaixo do peso mínimo devem utilizar lastros fornecidos pela organização.",
      "O uso de equipamentos de segurança (capacete, luvas, sapatilha e macacão) é obrigatório.",
      "Todos os equipamentos devem estar em boas condições de conservação.",
      "A organização se reserva o direito de vetar o uso de equipamentos considerados inadequados."
    ]
  },
  {
    id: "conduta",
    title: "Código de Conduta",
    icon: <Info className="h-5 w-5" />,
    content: [
      "Todos os pilotos devem participar do briefing antes da corrida.",
      "Comportamento agressivo ou antidesportivo dentro ou fora da pista resultará em penalidades.",
      "Pilotos devem respeitar as sinalizações e instruções dos fiscais de pista.",
      "É proibido o consumo de álcool ou substâncias ilícitas antes ou durante os eventos.",
      "Reclamações ou questionamentos devem ser feitos formalmente à direção de prova, através de formulário específico.",
      "A organização se reserva o direito de exclusão de participantes que descumpram gravemente as regras ou apresentem comportamento prejudicial ao evento."
    ]
  }
];

export function Club({ section }: ClubProps) {
  const { alias } = useParams()
  const { selectedClub, selectClub } = useClub()
  const [activeCategory, setActiveCategory] = useState<string>("Pro")
  
  if (!selectedClub) {
    const club = CLUBS.find(c => c.alias === alias)
    if (!club) return <Navigate to="/" />
    selectClub(club)
    return null
  }

  const clubInfo = CLUB_INFO[selectedClub.alias as keyof typeof CLUB_INFO]

  // Get all unique categories from the ranking data
  const categories = Array.from(new Set(RANKING.map(pilot => pilot.category)))

  // Filter pilots by category and re-number positions
  const getPilotsByCategory = (category: string) => {
    return RANKING
      .filter(pilot => pilot.category === category)
      .sort((a, b) => b.points - a.points)
      .map((pilot, index) => ({
        ...pilot,
        position: index + 1
      }))
  }

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

  // Render different content based on the selected section/tab
  const renderContent = () => {
    switch (section) {
      case 'calendario':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary-500" />
              Calendário de Eventos
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
                  <div className="text-sm text-muted-foreground mb-2">
                    {event.date} às {event.time} • {event.type}
                  </div>
                  <div className="text-xs flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {event.participants}/{event.maxParticipants} participantes
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'classificacao':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary-500" />
                Classificação
              </h2>
              
              <div className="flex bg-muted/30 rounded-md p-1">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? "bg-primary-500 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/20 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Categoria {activeCategory}</h3>
                <div className="text-sm text-muted-foreground">
                  {getPilotsByCategory(activeCategory).length} pilotos
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-muted/30">
                      <th className="py-3 text-left font-medium">Pos.</th>
                      <th className="py-3 text-left font-medium">Piloto</th>
                      <th className="py-3 text-left font-medium">Pontos</th>
                      <th className="py-3 text-left font-medium">Vitórias</th>
                      <th className="py-3 text-left font-medium">Pódios</th>
                      <th className="py-3 text-right font-medium">Última Corrida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPilotsByCategory(activeCategory).map(pilot => (
                      <tr key={pilot.name} className="border-b border-muted/20 hover:bg-muted/20 transition-colors">
                        <td className={`py-3 ${getPositionColor(pilot.position)} font-bold`}>
                          {pilot.position}º
                        </td>
                        <td className="py-3 font-medium">{pilot.name}</td>
                        <td className="py-3 font-bold text-primary-500">{pilot.points}</td>
                        <td className="py-3">{pilot.wins}</td>
                        <td className="py-3">{pilot.podiums}</td>
                        <td className="py-3 text-muted-foreground text-right">{pilot.lastRace}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'regulamento':
        const [activeSection, setActiveSection] = useState(regulationSections[0].id);

        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Medal className="h-6 w-6 text-primary-500" />
                Regulamento Oficial
              </h2>
              <span className="text-sm bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full">
                Temporada 2024
              </span>
            </div>
            
            <p className="text-muted-foreground">
              Este documento estabelece as regras, procedimentos e diretrizes para todos os eventos e campeonatos 
              organizados pelo {selectedClub.name}. É responsabilidade de todos os pilotos conhecer e respeitar o regulamento.
            </p>
            
            <div className="grid md:grid-cols-[250px_1fr] gap-6">
              {/* Navigation sidebar */}
              <div className="bg-muted/20 rounded-lg p-4 h-fit">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">ÍNDICE</h3>
                <nav className="space-y-1">
                  {regulationSections.map(section => (
                    <button
                      key={section.id}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors ${
                        activeSection === section.id 
                          ? "bg-primary-500 text-white" 
                          : "hover:bg-muted/50 text-foreground"
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      {section.icon}
                      <span>{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Content area */}
              <div>
                {regulationSections.map(section => (
                  <div 
                    key={section.id}
                    className={`${activeSection === section.id ? "block" : "hidden"}`}
                  >
                    <div className="bg-muted/20 rounded-lg p-6">
                      <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                        {section.icon}
                        {section.title}
                      </h3>
                      
                      <div className="space-y-4">
                        {section.content.map((item, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></div>
                            </div>
                            <p className="text-foreground" dangerouslySetInnerHTML={{ __html: item }}></p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          const currentIndex = regulationSections.findIndex(s => s.id === activeSection);
                          const prevIndex = currentIndex > 0 ? currentIndex - 1 : regulationSections.length - 1;
                          setActiveSection(regulationSections[prevIndex].id);
                        }}
                      >
                        ← Anterior
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          const currentIndex = regulationSections.findIndex(s => s.id === activeSection);
                          const nextIndex = currentIndex < regulationSections.length - 1 ? currentIndex + 1 : 0;
                          setActiveSection(regulationSections[nextIndex].id);
                        }}
                      >
                        Próximo →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Atualizações do Regulamento</h4>
                  <p className="text-sm text-muted-foreground">Este regulamento pode ser atualizado durante a temporada. Todas as alterações serão comunicadas com antecedência mínima de 15 dias antes do próximo evento.</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        // Home section - show the default/home content
        return (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10"
            >
              <h1 className="text-4xl font-bold mb-4">{selectedClub.name}</h1>
              <p className="text-muted-foreground">{clubInfo?.description}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary-500" />
                Sobre o Clube
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-muted/30 rounded-lg p-6 space-y-5">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Localização</h3>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{clubInfo?.location.city}, {clubInfo?.location.state}</p>
                        <p className="text-sm text-muted-foreground">Região: {clubInfo?.location.region}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Contato</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary-500" />
                        <span>{clubInfo?.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary-500" />
                        <span>{clubInfo?.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-5 w-5 text-primary-500" />
                        <span>{clubInfo?.contact.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6 space-y-5">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Histórico</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background/50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-500">{clubInfo?.history.founded}</p>
                        <p className="text-sm text-muted-foreground">Ano de fundação</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-500">{clubInfo?.history.totalEvents}</p>
                        <p className="text-sm text-muted-foreground">Eventos realizados</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-500">{clubInfo?.history.totalPilots}</p>
                        <p className="text-sm text-muted-foreground">Pilotos participantes</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-500">{clubInfo?.championships.total}</p>
                        <p className="text-sm text-muted-foreground">Campeonatos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Categorias</h3>
                    <div className="flex gap-2">
                      {clubInfo?.championships.categories.map(category => (
                        <span 
                          key={category} 
                          className="bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-8 mb-16"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CalendarDays className="h-6 w-6 text-primary-500" />
                  Próximos Eventos
                </h2>
                <div className="space-y-4">
                  {EVENTS.slice(0, 2).map(event => (
                    <div key={event.id} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
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
                      <div className="text-sm text-muted-foreground mb-2">
                        {event.date} às {event.time} • {event.type}
                      </div>
                      <div className="text-xs flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {event.participants}/{event.maxParticipants} participantes
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/clube/${selectedClub.alias}/calendario`}>
                      Ver todos os eventos
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary-500" />
                  Top Pilotos
                </h2>
                
                <div className="space-y-6">
                  {categories.map(category => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded text-sm">
                          {category}
                        </span>
                      </h3>
                      
                      <div className="space-y-2">
                        {getPilotsByCategory(category).slice(0, 3).map(pilot => (
                          <div 
                            key={pilot.name}
                            className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              pilot.position === 1 ? "bg-yellow-500/20" : 
                              pilot.position === 2 ? "bg-gray-400/20" : 
                              "bg-amber-700/20"
                            }`}>
                              <span className={`font-bold ${getPositionColor(pilot.position)}`}>{pilot.position}º</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{pilot.name}</h3>
                              <p className="text-xs text-muted-foreground">{pilot.wins} vitórias • {pilot.podiums} pódios</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary-500">{pilot.points} pts</p>
                              <p className="text-xs text-muted-foreground">{pilot.lastRace}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/clube/${selectedClub.alias}/classificacao`}>
                    Ver classificação completa
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Medal className="h-6 w-6 text-primary-500" />
                Nossos Patrocinadores
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Patrocinador Principal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SPONSORS.filter(s => s.type === "Principal").map(sponsor => (
                      <div 
                        key={sponsor.id}
                        className="bg-muted/30 rounded-lg p-6 flex flex-col items-center hover:bg-muted/50 transition-colors"
                      >
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name} 
                          className="h-24 object-contain mb-4" 
                        />
                        <h4 className="font-medium text-center">{sponsor.name}</h4>
                        <a 
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-500 text-sm hover:underline mt-2 flex items-center gap-1"
                        >
                          <LinkIcon className="h-3 w-3" />
                          Visitar site
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Patrocinadores Oficiais e Apoiadores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {SPONSORS.filter(s => s.type !== "Principal").map(sponsor => (
                      <div 
                        key={sponsor.id}
                        className="bg-muted/30 rounded-lg p-4 flex flex-col items-center hover:bg-muted/50 transition-colors"
                      >
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name} 
                          className="h-16 object-contain mb-3" 
                        />
                        <h4 className="font-medium text-center text-sm">{sponsor.name}</h4>
                        <span className="text-xs text-muted-foreground">{sponsor.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container px-8 py-16"
    >
      <div className="max-w-4xl mx-auto">
        {renderContent()}
      </div>
    </motion.div>
  )
} 