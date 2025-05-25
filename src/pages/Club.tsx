import { useClub } from "@/contexts/ClubContext"
import { motion } from "framer-motion"
import { useParams, Link } from "react-router-dom"
import { CalendarDays, Trophy, Users, Medal, MapPin, Phone, Mail, Link as LinkIcon, Hash, Shield, Flag, Award, AlertTriangle, Scale, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Tab } from "@/components/ui/Tab"
import { useLocation } from "react-router-dom"

interface Event {
  id: number
  title: string
  date: string
  time: string
  type: string
  status: string
  participants: number
  maxParticipants: number
  clubId: number
  description: string
  location: string
  price: number
}

interface RankingPilot {
  id: string
  position: number
  name: string
  slug?: string
  nickname?: string
  number?: number
  points: number
  wins: number
  podiums: number
  lastRace: string
}

interface RankingData {
  clubId: number
  category: string
  championship: string
  season: string
  currentStage: number
  totalStages: number
  pilots: RankingPilot[]
}

// Interface para o conteúdo do regulamento
interface RegulationSection {
  id: string;
  title: string;
  iconName: string;
  content: string[];
}

interface Regulation {
  clubId: number;
  year: string;
  lastUpdated: string;
  sections: RegulationSection[];
}

// Make this interface exportable
export interface ClubProps {
  section?: 'calendario' | 'classificacao' | 'regulamento';
}

export function Club({ section }: ClubProps) {
  const { alias } = useParams()
  const { selectedClub, selectClub, allClubs } = useClub()
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [clubEvents, setClubEvents] = useState<Event[]>([])
  const [clubRankings, setClubRankings] = useState<RankingData[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [clubRegulations, setClubRegulations] = useState<Regulation | null>(null)
  const [activeSection, setActiveSection] = useState<string>("")
  const location = useLocation()
  
  useEffect(() => {
    if (!selectedClub) {
      const club = allClubs.find(c => c.alias === alias)
      if (!club) return;
      selectClub(club)
      return;
    }
    // Fetch all data in parallel
    Promise.all([
      fetch(`${import.meta.env.VITE_CACHE_API_URL}/cache/event`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_CACHE_API_URL}/cache/ranking`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_CACHE_API_URL}/cache/regulation`).then(res => res.json()),
    ]).then(([eventsRes, rankingsRes, regulationsRes]) => {
      const events = (eventsRes.data || []).filter((event: Event) => String(event.clubId) === String(selectedClub.id))
      setClubEvents(events)
      const rankings = (rankingsRes.data || []).filter((ranking: RankingData) => String(ranking.clubId) === String(selectedClub.id))
      setClubRankings(rankings)
      const regulation = (regulationsRes.data || []).find((reg: Regulation) => String(reg.clubId) === String(selectedClub.id))
      setClubRegulations(regulation || null)
      if (regulation && regulation.sections && regulation.sections.length > 0) {
        setActiveSection(regulation.sections[0].id)
      }
      if (rankings.length > 0) {
        const cats = rankings.map((r: RankingData) => r.category)
        setCategories(cats)
        const params = new URLSearchParams(location.search)
        const categoryParam = params.get('category')
        if (categoryParam && cats.includes(categoryParam)) {
          setActiveCategory(categoryParam)
        } else {
          setActiveCategory(cats[0])
        }
      }
    })
  }, [selectedClub, alias, selectClub, location.search, allClubs])

  if (!selectedClub) {
    return null;
  }

  // Get pilots by category
  const getPilotsByCategory = (category: string) => {
    const ranking = clubRankings?.find(r => r.category === category);
    return ranking?.pilots || [];
  }

  // Color based on position
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

  // Adicionar uma função auxiliar para garantir slugs válidos
  const getValidPilotSlug = (pilot: RankingPilot) => {
    // Se o piloto já tem um slug, use-o
    if (pilot.slug) return pilot.slug;
    
    // Caso contrário, gere um slug a partir do nome
    return pilot.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/--+/g, '-'); // Remove hífens duplicados
  }

  // Renderiza a seção de patrocinadores
  const renderSponsors = () => {
    if (!selectedClub || !selectedClub.sponsors || selectedClub.sponsors.length === 0) {
      return null;
    }

    const principalSponsors = selectedClub.sponsors.filter(s => s.type === "Principal");
    const otherSponsors = selectedClub.sponsors.filter(s => s.type !== "Principal");

    return (
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
          {principalSponsors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Patrocinador Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {principalSponsors?.map(sponsor => (
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
          )}
          
          {otherSponsors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Patrocinadores Oficiais e Apoiadores</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {otherSponsors?.map(sponsor => (
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
          )}
        </div>
      </motion.div>
    );
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
              {clubEvents?.map(event => (
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
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary-500" />
              Classificação
            </h2>
            
            {/* Categorias tabs */}
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
              {categories?.map(category => (
                <Tab 
                  key={category}
                  isActive={category === activeCategory}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Tab>
              ))}
            </div>
            
            {/* Ranking tables */}
            <div className="space-y-8">
              {categories?.map(category => {
                const pilots = getPilotsByCategory(category);
                const ranking = clubRankings?.find(r => r.category === category);
                
                return (
                  <div key={category} className={`${category === activeCategory ? 'block' : 'hidden'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-medium">{category}</h3>
                        <p className="text-sm text-muted-foreground">
                          {ranking?.championship} • {ranking?.season}
                        </p>
                      </div>
                      <div className="text-sm text-primary-500 font-medium">
                        Etapa {ranking?.currentStage}/{ranking?.totalStages}
                      </div>
                    </div>
                    
                    {/* Table header */}
                    <div className="grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,auto,auto,auto] gap-4 bg-muted/30 p-3 rounded-t-lg text-xs font-medium text-muted-foreground">
                      <div>#</div>
                      <div>Piloto</div>
                      <div className="text-right">Pontos</div>
                      <div className="hidden md:block text-center">Vitórias</div>
                      <div className="hidden md:block text-center">Pódios</div>
                    </div>
                    
                    {/* Pilots list */}
                    <div className="bg-muted/10 rounded-b-lg overflow-hidden">
                      {pilots?.map(pilot => (
                        <Link 
                          key={pilot.id}
                          to={`/pilotos/${getValidPilotSlug(pilot)}`}
                          className="block"
                        >
                          <div className="grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,auto,auto,auto] gap-4 p-3 border-b border-muted/20 last:border-0 hover:bg-muted/30 transition-colors">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              pilot.position === 1 ? "bg-yellow-500/20 text-yellow-500" : 
                              pilot.position === 2 ? "bg-gray-400/20 text-gray-400" : 
                              pilot.position === 3 ? "bg-amber-700/20 text-amber-700" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {pilot.position}
                            </div>
                            <div className="flex items-center">
                              <div>
                                {pilot.nickname ? (
                                  <>
                                    <span className="font-medium">{pilot.name.split(' ')[0]}</span>
                                    <span className="hidden sm:inline text-muted-foreground"> {pilot.name.split(' ').slice(1).join(' ')}</span>
                                    <div className="text-xs text-muted-foreground">"{pilot.nickname}"</div>
                                  </>
                                ) : (
                                  <span className="font-medium">{pilot.name}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right font-bold my-auto">
                              {pilot.points}
                            </div>
                            <div className="hidden md:flex justify-center items-center">
                              {pilot.wins}
                            </div>
                            <div className="hidden md:flex justify-center items-center">
                              {pilot.podiums}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        );
      
      case 'regulamento':
        if (!clubRegulations || !clubRegulations.sections) return <div className="text-center py-10">Regulamento não disponível</div>;

        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Medal className="h-6 w-6 text-primary-500" />
                Regulamento Oficial
              </h2>
              <span className="text-sm bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full">
                Temporada {clubRegulations.year}
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
                  {clubRegulations.sections?.map((section: RegulationSection) => {
                    // Mapeie o nome do ícone para o componente correspondente
                    let IconComponent;
                    switch(section.iconName) {
                      case 'Shield': IconComponent = Shield; break;
                      case 'Flag': IconComponent = Flag; break;
                      case 'Hash': IconComponent = Hash; break;
                      case 'Award': IconComponent = Award; break;
                      case 'AlertTriangle': IconComponent = AlertTriangle; break;
                      case 'Scale': IconComponent = Scale; break;
                      case 'Info': IconComponent = Info; break;
                      default: IconComponent = Info;
                    }
                    
                    return (
                      <button
                        key={section.id}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors ${
                          activeSection === section.id 
                            ? "bg-primary-500 text-white" 
                            : "hover:bg-muted/50 text-foreground"
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span>{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Content area */}
              <div>
                {clubRegulations.sections?.map((section: RegulationSection) => {
                  // Mapeie o nome do ícone para o componente correspondente
                  let IconComponent;
                  switch(section.iconName) {
                    case 'Shield': IconComponent = Shield; break;
                    case 'Flag': IconComponent = Flag; break;
                    case 'Hash': IconComponent = Hash; break;
                    case 'Award': IconComponent = Award; break;
                    case 'AlertTriangle': IconComponent = AlertTriangle; break;
                    case 'Scale': IconComponent = Scale; break;
                    case 'Info': IconComponent = Info; break;
                    default: IconComponent = Info;
                  }
                  
                  return (
                    <div 
                      key={section.id}
                      className={`${activeSection === section.id ? "block" : "hidden"}`}
                    >
                      <div className="bg-muted/20 rounded-lg p-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                          <IconComponent className="h-5 w-5" />
                          {section.title}
                        </h3>
                        
                        <div className="space-y-4">
                          {section.content?.map((item: string, i: number) => (
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
                            const currentIndex = clubRegulations.sections?.findIndex((s: RegulationSection) => s.id === activeSection) || 0;
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : (clubRegulations.sections?.length || 1) - 1;
                            setActiveSection(clubRegulations.sections?.[prevIndex]?.id || '');
                          }}
                        >
                          ← Anterior
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => {
                            const currentIndex = clubRegulations.sections?.findIndex((s: RegulationSection) => s.id === activeSection) || 0;
                            const nextIndex = currentIndex < (clubRegulations.sections?.length || 1) - 1 ? currentIndex + 1 : 0;
                            setActiveSection(clubRegulations.sections?.[nextIndex]?.id || '');
                          }}
                        >
                          Próximo →
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Atualizações do Regulamento</h4>
                  <p className="text-sm text-muted-foreground">Este regulamento pode ser atualizado durante a temporada. Última atualização: {clubRegulations.lastUpdated}</p>
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
              <p className="text-muted-foreground">{selectedClub.description}</p>
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
                        <p className="font-medium">{selectedClub.location.city}, {selectedClub.location.state}</p>
                        <p className="text-sm text-muted-foreground">Região: {selectedClub.location.region}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Contato</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary-500" />
                        <span>{selectedClub.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary-500" />
                        <span>{selectedClub.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-5 w-5 text-primary-500" />
                        <span>{selectedClub.contact.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6 space-y-5">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Histórico</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background/50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-500">{selectedClub.history.founded}</p>
                        <p className="text-sm text-muted-foreground">Ano de fundação</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-500">{selectedClub.history.totalEvents}</p>
                        <p className="text-sm text-muted-foreground">Eventos realizados</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-500">{selectedClub.history.totalPilots}</p>
                        <p className="text-sm text-muted-foreground">Pilotos participantes</p>
                      </div>
                      <div className="bg-background/50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-primary-500">{selectedClub.championships?.total || 0}</p>
                        <p className="text-sm text-muted-foreground">Campeonatos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Categorias</h3>
                    <div className="flex gap-2">
                      {selectedClub.championships?.categories?.map(category => (
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
                  {clubEvents?.slice(0, 2)?.map(event => (
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
                  {categories?.map(category => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded text-sm">
                          {category}
                        </span>
                      </h3>
                      
                      <div className="space-y-2">
                        {getPilotsByCategory(category)?.slice(0, 3)?.map(pilot => (
                          <Link 
                            key={pilot.id}
                            to={`/pilotos/${getValidPilotSlug(pilot)}`}
                            className="block"
                          >
                            <div 
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
                          </Link>
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
            
            {renderSponsors()}
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