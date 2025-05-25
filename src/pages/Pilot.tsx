import { useParams, Navigate, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Trophy, Flag, CalendarDays, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useClub, Club } from "@/contexts/ClubContext"
import { getInitials, normalizeSlug } from "@/utils/pilot-utils"

// Interface para o tipo Pilot
interface Pilot {
  id: string;
  name: string;
  slug: string;
  nickname?: string;
  number: number;
  avatar_url?: string;
  category: string;
  clubs: {
    id: number;
    name: string;
    alias: string;
    primary: boolean;
  }[];
  points: number;
  position: number;
  stats: {
    wins: number;
    podiums: number;
    polePositions: number;
    fastestLaps: number;
    races: number;
    championships: number;
  };
  last_races: {
    event: string;
    date: string;
    result: string;
    points: number;
    club: string;
  }[];
  bio: string;
}

export function Pilot() {
  const { pilotSlug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'stats' | 'races' | 'bio' | 'clubs'>('stats')
  const { selectClub, allClubs } = useClub() // Importando o contexto do clube
  const [pilot, setPilot] = useState<Pilot | null>(null)
  const [rankings, setRankings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Fetch pilots and rankings in parallel
    Promise.all([
      fetch(`${import.meta.env.VITE_CACHE_API_URL}/cache/pilot`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_CACHE_API_URL}/cache/ranking`).then(res => res.json())
    ])
      .then(async ([pilotsRes, rankingsRes]) => {
        const pilots: Pilot[] = pilotsRes.data || [];
        const allRankings = rankingsRes.data || [];
        const found = pilots.find(pilot => 
          pilot.slug === pilotSlug || 
          normalizeSlug(pilot.name) === pilotSlug
        );
        if (!found) {
          setError('notfound');
          setLoading(false);
          return;
        }
        // Fetch the pilot by id
        try {
          const pilotRes = await fetch(`${import.meta.env.VITE_CACHE_API_URL}/cache/pilot/${found.id}`);
          if (!pilotRes.ok) throw new Error('notfound');
          const pilotData = await pilotRes.json();
          setPilot(pilotData);
          setError(null);
          // Filter rankings for the clubs the pilot participates in
          const clubIds = pilotData.clubs.map((club: any) => club.id);
          const filteredRankings = allRankings.filter((ranking: any) => clubIds.includes(ranking.clubId) || clubIds.includes(String(ranking.clubId)));
          setRankings(filteredRankings);
          setLoading(false);
        } catch {
          setError('notfound');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('notfound');
        setLoading(false);
      });
  }, [pilotSlug])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (error === 'notfound' || !pilot) {
    return <Navigate to="/" />;
  }
  
  // Voltar para a página anterior
  const handleGoBack = () => {
    navigate(-1)
  }
  
  // Função auxiliar para obter os dados completos do clube
  const getFullClubData = (clubId: string): Club | undefined => {
    return allClubs.find(club => String(club.id) === String(clubId))
  }
  
  // Função para navegar para a página de um clube
  const navigateToClub = (clubId: number) => {
    const clubData = getFullClubData(String(clubId))
    if (clubData) {
      selectClub(clubData) // Atualiza o clube selecionado no contexto
      navigate(`/clube/${clubData.alias}`)
    }
  }
  
  // Obter classificações do piloto em todos os clubes
  const getPilotRankings = () => {
    const result = []
    for (const club of pilot.clubs) {
      const clubRankings = rankings.filter(ranking => String(ranking.clubId) === String(club.id))
      for (const ranking of clubRankings) {
        const pilotInRanking = ranking.pilots.find((p: any) => String(p.id) === String(pilot.id))
        if (pilotInRanking) {
          result.push({
            club: club,
            clubId: club.id,
            category: ranking.category,
            championship: ranking.championship,
            season: ranking.season,
            currentStage: ranking.currentStage,
            totalStages: ranking.totalStages,
            position: pilotInRanking.position,
            points: pilotInRanking.points,
            wins: pilotInRanking.wins,
            podiums: pilotInRanking.podiums,
            lastRace: pilotInRanking.lastRace
          })
        }
      }
    }
    return result
  }
  
  // Cores baseadas na posição
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

  // Função para obter o badge da posição
  const getPositionBadge = (position: number) => {
    return (
      <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
        position === 1 ? "bg-yellow-500/20" : 
        position === 2 ? "bg-gray-400/20" : 
        position === 3 ? "bg-amber-700/20" :
        "bg-muted/40"
      }`}>
        <span className={`text-sm font-bold ${getPositionColor(position)}`}>{position}º</span>
      </div>
    );
  }
  
  // Gerar uma versão estilizada do nome do piloto para o banner
  const getStylizedName = (name: string) => {
    const nameParts = name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')
    
    return (
      <>
        <span className="font-normal">{firstName}</span>
        {lastName && <span className="font-bold"> {lastName}</span>}
      </>
    )
  }
  
  // Renderizar conteúdo baseado na tab ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-500">{pilot.stats.wins}</div>
                <div className="text-sm text-muted-foreground">Vitórias</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-500">{pilot.stats.podiums}</div>
                <div className="text-sm text-muted-foreground">Pódios</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-500">{pilot.stats.polePositions}</div>
                <div className="text-sm text-muted-foreground">Poles</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-500">{pilot.stats.fastestLaps}</div>
                <div className="text-sm text-muted-foreground">Voltas Rápidas</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-500">{pilot.stats.races}</div>
                <div className="text-sm text-muted-foreground">Corridas</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-500">{pilot.stats.championships}</div>
                <div className="text-sm text-muted-foreground">Campeonatos</div>
              </div>
            </div>
            
            {/* Classificações em todos os clubes */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary-500" />
                Classificações
              </h3>
              <div className="space-y-5">
                {getPilotRankings().map((ranking, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Flag className="h-4 w-4 text-primary-500" />
                          <h4 className="font-medium">{ranking.club.name}</h4>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ranking.championship} • {ranking.category} • {ranking.season}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPositionBadge(ranking.position)}
                        <div className="text-right">
                          <div className="font-bold text-primary-500">{ranking.points} pts</div>
                          <div className="text-xs text-muted-foreground">Etapa {ranking.currentStage}/{ranking.totalStages}</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="text-center bg-muted/30 rounded p-2">
                        <div className="text-sm font-medium">{ranking.wins}</div>
                        <div className="text-xs text-muted-foreground">Vitórias</div>
                      </div>
                      <div className="text-center bg-muted/30 rounded p-2">
                        <div className="text-sm font-medium">{ranking.podiums}</div>
                        <div className="text-xs text-muted-foreground">Pódios</div>
                      </div>
                      <div className="text-center bg-muted/30 rounded p-2">
                        <div className="text-sm font-medium">{ranking.lastRace}</div>
                        <div className="text-xs text-muted-foreground">Última</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-3 text-xs"
                      onClick={() => {
                        const clubData = getFullClubData(String(ranking.clubId))
                        if (clubData) {
                          selectClub(clubData)
                          navigate(`/clube/${ranking.club.alias}/classificacao?category=${encodeURIComponent(ranking.category)}`)
                        }
                      }}
                    >
                      Ver classificação completa
                    </Button>
                  </div>
                ))}
                
                {getPilotRankings().length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    Não há classificações disponíveis para este piloto
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      case 'races':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary-500" />
              Últimas Corridas
            </h3>
            <div className="space-y-3">
              {pilot.last_races.map((race, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">{race.event}</h4>
                    <span className="font-bold text-primary-500">{race.points} pts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{race.date}</span>
                    <span className="font-medium">{race.result}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    <Flag className="h-3 w-3 inline mr-1" />
                    {race.club}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'bio':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-primary-500" />
              Biografia
            </h3>
            <div className="bg-muted/30 rounded-lg p-6">
              <p className="leading-relaxed">{pilot.bio}</p>
            </div>
          </div>
        )
      
      case 'clubs':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary-500" />
              Clubes
            </h3>
            <div className="space-y-3">
              {pilot.clubs.map((club) => (
                <div 
                  key={club.id} 
                  className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigateToClub(club.id)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{club.name}</h4>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Clique para ver detalhes do clube
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Botão voltar */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6 text-muted-foreground hover:text-foreground"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cabeçalho do piloto - Redesenhado */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex items-start gap-4">
              {/* Foto do piloto e número */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 overflow-hidden rounded-full border-2 border-primary-500/30 flex items-center justify-center bg-muted">
                  {pilot.avatar_url ? (
                    <img 
                      src={pilot.avatar_url} 
                      alt={pilot.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-primary-500">
                      {getInitials(pilot.name)}
                    </span>
                  )}
                </div>
                
                {pilot.number && (
                  <div className="bg-primary-500 text-white font-bold px-3 py-1 rounded-md text-lg w-full text-center">
                    #{pilot.number}
                  </div>
                )}
              </div>
              
              {/* Informações do piloto */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold">{getStylizedName(pilot.name)}</h1>
                
                <div className="flex items-center gap-2 mt-1">
                  {pilot.nickname && (
                    <span className="bg-muted px-2 py-0.5 rounded-full text-sm">
                      "{pilot.nickname}"
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center bg-muted/30 px-3 py-1 rounded-md">
                    <User className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="text-sm font-medium">{pilot.category}</span>
                  </div>
                  
                  <div className="flex items-center bg-muted/30 px-3 py-1 rounded-md">
                    <Trophy className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="text-sm font-medium">{pilot.points} pontos</span>
                  </div>
                  
                  <div className="flex items-center bg-muted/30 px-3 py-1 rounded-md">
                    <Flag className="h-4 w-4 mr-2 text-primary-500" />
                    <span className="text-sm font-medium">
                      {pilot.clubs.length} {pilot.clubs.length === 1 ? 'clube' : 'clubes'}
                    </span>
                  </div>
                </div>
                
                {/* Lista de clubes */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-sm text-muted-foreground mb-1">Participa em:</h3>
                  <div className="flex flex-wrap gap-2">
                    {pilot.clubs.map((club) => (
                      <Button 
                        key={club.id}
                        variant="outline" 
                        size="sm"
                        className="text-xs flex items-center gap-1"
                        onClick={() => navigateToClub(club.id)}
                      >
                        <Flag className="h-3 w-3" />
                        {club.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs de navegação */}
          <div className="border-b mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('stats')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'stats' 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Estatísticas
              </button>
              <button
                onClick={() => setActiveTab('races')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'races' 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Últimas Corridas
              </button>
              <button
                onClick={() => setActiveTab('bio')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'bio' 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab('clubs')}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'clubs' 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Clubes
              </button>
            </div>
          </div>
          
          {/* Conteúdo da tab */}
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
} 