import { useParams, Navigate, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Trophy, CalendarDays, User, ArrowLeft } from "lucide-react"
import { Button } from "brk-design-system"
import { useState, useEffect } from "react"
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
  }[];
  bio: string;
}

export function Pilot() {
  const { pilotSlug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'stats' | 'races' | 'bio'>('stats')
  const [pilot, setPilot] = useState<Pilot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`${import.meta.env.VITE_CACHE_API_URL}/cache/pilot`)
      .then(res => res.json())
      .then(async (pilotsRes) => {
        const pilots: Pilot[] = pilotsRes.data || [];
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
            {/* Estatísticas gerais */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                <div className="text-sm text-muted-foreground">Pole Positions</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary-500">{pilot.stats.fastestLaps}</div>
                <div className="text-sm text-muted-foreground">Voltas Mais Rápidas</div>
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
          </div>
        );
      
      case 'races':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Últimas Corridas</h3>
            {pilot.last_races && pilot.last_races.length > 0 ? (
              <div className="space-y-3">
                {pilot.last_races.map((race, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{race.event}</h4>
                      <span className="text-sm text-muted-foreground">{race.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{race.result}</span>
                      <span className="text-sm font-medium text-primary-500">{race.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma corrida registrada
              </div>
            )}
          </div>
        );
      
      case 'bio':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Biografia</h3>
            {pilot.bio ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">{pilot.bio}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Biografia não disponível
              </div>
            )}
          </div>
        );
      
      default:
        return null;
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
        {/* Botão voltar */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-primary-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* Header do piloto */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-primary-500/10 to-primary-600/5 rounded-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 text-2xl font-bold">
              {pilot.avatar_url ? (
                <img 
                  src={pilot.avatar_url} 
                  alt={pilot.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                getInitials(pilot.name)
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {getStylizedName(pilot.name)}
                </h1>
                <div className="bg-primary-500/20 text-primary-500 px-3 py-1 rounded-full text-sm font-medium">
                  #{pilot.number}
                </div>
              </div>
              
              {pilot.nickname && (
                <p className="text-lg text-muted-foreground mb-2">"{pilot.nickname}"</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary-500" />
                  <span>{pilot.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pilot.points} pontos</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navegação por tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-1 mb-8 bg-muted/30 p-1 rounded-lg"
        >
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-background text-primary-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trophy className="h-4 w-4" />
            Estatísticas
          </button>
          <button
            onClick={() => setActiveTab('races')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'races'
                ? 'bg-background text-primary-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Corridas
          </button>
          <button
            onClick={() => setActiveTab('bio')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'bio'
                ? 'bg-background text-primary-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-4 w-4" />
            Biografia
          </button>
        </motion.div>

        {/* Conteúdo da tab ativa */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </motion.div>
  )
} 