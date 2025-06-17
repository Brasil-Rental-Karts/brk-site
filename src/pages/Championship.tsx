import { useState, useEffect, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "brk-design-system";
import { ChampionshipHeader } from "@/components/championship/ChampionshipHeader";
import { HomeTab } from "@/components/championship/tabs/HomeTab";
import { CalendarioTab } from "@/components/championship/tabs/CalendarioTab";
import { ClassificacaoTab } from "@/components/championship/tabs/ClassificacaoTab";
import { RegulamentoTab } from "@/components/championship/tabs/RegulamentoTab";
import { FotosTab } from "@/components/championship/tabs/FotosTab";
import { useChampionships } from "@/hooks/useChampionships";
import { 
  mapApiChampionshipToUI, 
  findChampionshipBySlug, 
  type ChampionshipUI 
} from "@/utils/championship.utils";
import { championshipService } from "@/services/championship.service";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "brk-design-system";

interface ChampionshipData {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  location: string;
  founded: string;
  pilots: number;
  seasons: number;
  categories: number;
  status: "active" | "upcoming" | "finished";
  image: string;
  avatar: string;
}

/**
 * Página individual de um campeonato específico
 * Recebe o slug via parâmetros da URL e exibe as informações detalhadas
 */
export const Championship = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState("home");

  // Buscar dados dos campeonatos da API
  const { 
    championships: apiChampionships, 
    seasons,
    stages,
    loading, 
    error, 
    refetch,
    getActiveSeasonsCount,
    getActiveCategoriesCount,
    getSeasonsForChampionship,
    getStagesForChampionship
  } = useChampionships();

  // Converter dados da API para o formato do UI
  const championships = useMemo(() => {
    return apiChampionships.map(apiChampionship => {
      const activeSeasonsCount = getActiveSeasonsCount(apiChampionship.id);
      const activeCategoriesCount = getActiveCategoriesCount(apiChampionship.id);
      return mapApiChampionshipToUI(apiChampionship, activeSeasonsCount, activeCategoriesCount);
    });
  }, [apiChampionships, getActiveSeasonsCount, getActiveCategoriesCount]);

  // Encontrar o campeonato pelo slug
  const currentChampionship = useMemo(() => {
    if (!slug || championships.length === 0) return null;
    return findChampionshipBySlug(championships, slug);
  }, [championships, slug]);

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando campeonato...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Erro ao carregar campeonato</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // Se o campeonato não for encontrado, redirecionar para a página de listagem
  if (!currentChampionship) {
    return <Navigate to="/campeonatos" replace />;
  }

  // Dados mockados dos campeonatos (mantendo a estrutura original para compatibilidade)
  const championshipsData: ChampionshipData[] = [
    {
      id: "1",
      slug: "escola-da-velocidade",
      name: "Escola da Velocidade",
      shortDescription: "Onde a paixão por kart ganha forma!",
      description: "Onde a paixão por kart ganha forma!",
      location: "Kartódromo Beto Carrero",
      founded: "2021",
      pilots: 100,
      seasons: 6,
      categories: 4,
      status: "active",
      image: "/escola-velocidade-hero.jpg",
      avatar: "/escola-velocidade-avatar.jpg"
    },
    {
      id: "2",
      slug: "copa-sul-brasileira",
      name: "Copa Sul Brasileira de Kart",
      shortDescription: "O maior campeonato de kart da região Sul",
      description: "O maior campeonato de kart da região Sul",
      location: "Kartódromo Internacional",
      founded: "2019",
      pilots: 150,
      seasons: 8,
      categories: 6,
      status: "active",
      image: "/copa-sul-hero.jpg",
      avatar: "/copa-sul-avatar.jpg"
    },
    {
      id: "3",
      slug: "desafio-das-estrelas",
      name: "Desafio das Estrelas",
      shortDescription: "Campeonato exclusivo para pilotos experientes",
      description: "Campeonato exclusivo para pilotos experientes",
      location: "Autódromo de Interlagos",
      founded: "2020",
      pilots: 80,
      seasons: 5,
      categories: 3,
      status: "active",
      image: "/desafio-estrelas-hero.jpg",
      avatar: "/desafio-estrelas-avatar.jpg"
    },
    {
      id: "4",
      slug: "rookie-championship",
      name: "Rookie Championship",
      shortDescription: "Campeonato voltado para novos talentos",
      description: "Campeonato voltado para novos talentos",
      location: "Kartódromo Speed Park",
      founded: "2022",
      pilots: 60,
      seasons: 3,
      categories: 2,
      status: "upcoming",
      image: "/rookie-championship-hero.jpg",
      avatar: "/rookie-championship-avatar.jpg"
    },
    {
      id: "5",
      slug: "masters-series",
      name: "Masters Series",
      shortDescription: "Série especial para pilotos veteranos",
      description: "Série especial para pilotos veteranos",
      location: "Kartódromo Granja Viana",
      founded: "2018",
      pilots: 45,
      seasons: 7,
      categories: 2,
      status: "finished",
      image: "/masters-series-hero.jpg",
      avatar: "/masters-series-avatar.jpg"
    },
    {
      id: "6",
      slug: "junior-kart-league",
      name: "Junior Kart League",
      shortDescription: "Liga dedicada aos jovens talentos",
      description: "Liga dedicada aos jovens talentos",
      location: "Kartódromo Aldeia da Serra",
      founded: "2023",
      pilots: 75,
      seasons: 2,
      categories: 3,
      status: "active",
      image: "/junior-league-hero.jpg",
      avatar: "/junior-league-avatar.jpg"
    }
  ];

  // Buscar temporadas e etapas do campeonato
  const championshipSeasons = getSeasonsForChampionship(currentChampionship.id);
  const championshipStages = getStagesForChampionship(currentChampionship.id);

  // Criar objeto no formato esperado pelos componentes
  const championshipForComponents = {
    id: currentChampionship.id,
    name: currentChampionship.name,
    description: currentChampionship.shortDescription, // Usar descrição curta
    founded: currentChampionship.founded || '2024',
    pilots: (currentChampionship.pilots || 0).toString(),
    seasons: (currentChampionship.seasons || 0).toString(),
    categories: (currentChampionship.categories || 0).toString(),
    kartodromo: currentChampionship.location || 'Kartódromo',
    longDescription: currentChampionship.fullDescription || currentChampionship.shortDescription, // Usar descrição completa
    image: currentChampionship.image, // Imagem do campeonato
    avatar: currentChampionship.avatar, // Avatar do campeonato
    stats: [
      { label: "FUNDAÇÃO", value: currentChampionship.founded || '2024' },
      { label: "PILOTOS", value: (currentChampionship.pilots || 0).toString() },
      { label: "TEMPORADAS ATIVAS", value: (currentChampionship.activeSeasons || 0).toString() },
      { label: "CATEGORIAS ATIVAS", value: (currentChampionship.activeCategories || 0).toString() }
    ],
    currentSeason: {
      name: championshipSeasons.length > 0 ? championshipSeasons[0].name : "Temporada Atual",
      year: championshipSeasons.length > 0 ? new Date(championshipSeasons[0].startDate).getUTCFullYear().toString() : "2025",
      season: championshipSeasons.length > 0 ? championshipSeasons[0].name : "Temporada 1"
    },
    availableSeasons: championshipSeasons,
    events: championshipStages.map(stage => championshipService.formatStageForUI(stage)),
    sponsors: Array.isArray(currentChampionship.sponsors) ? currentChampionship.sponsors : []
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header do campeonato - fullwidth */}
      <ChampionshipHeader championship={championshipForComponents} />

      {/* Tabs - fullwidth */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <TabsList className="w-full justify-start rounded-none bg-dark-900 border-border h-12 px-6">
            <TabsTrigger value="home" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              Home
            </TabsTrigger>
            <TabsTrigger value="calendario" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              Calendário
            </TabsTrigger>
            <TabsTrigger value="classificacao" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              Classificação
            </TabsTrigger>
            <TabsTrigger value="regulamento" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              Regulamento
            </TabsTrigger>
            <TabsTrigger value="fotos" className="text-white data-[state=active]:bg-primary data-[state=active]:text-white">
              Fotos
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Conteúdo das tabs - sem espaçamento superior */}
        <div>
          <TabsContent value="home" className="mt-0">
            <HomeTab championship={championshipForComponents} />
          </TabsContent>

          <TabsContent value="calendario" className="mt-0 px-6 py-8">
            <CalendarioTab championship={championshipForComponents} />
          </TabsContent>

          <TabsContent value="classificacao" className="mt-0 px-6 py-8">
            <ClassificacaoTab championship={championshipForComponents} />
          </TabsContent>

          <TabsContent value="regulamento" className="mt-0 px-6 py-8">
            <RegulamentoTab championship={championshipForComponents} />
          </TabsContent>

          <TabsContent value="fotos" className="mt-0 px-6 py-8">
            <FotosTab championship={championshipForComponents} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}; 