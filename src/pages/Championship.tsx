import { useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "brk-design-system";
import { ChampionshipHeader } from "@/components/championship/ChampionshipHeader";
import { HomeTab } from "@/components/championship/tabs/HomeTab";
import { CalendarioTab } from "@/components/championship/tabs/CalendarioTab";
// import { ClassificacaoTab } from "@/components/championship/tabs/ClassificacaoTab";
// import { RegulamentoTab } from "@/components/championship/tabs/RegulamentoTab";
// import { FotosTab } from "@/components/championship/tabs/FotosTab";
import { useChampionships } from "@/hooks/useChampionships";
import { 
  mapApiChampionshipToUI, 
  findChampionshipBySlug
} from "@/utils/championship.utils";
import { championshipService } from "@/services/championship.service";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "brk-design-system";

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

  // Buscar temporadas e etapas do campeonato
  const championshipSeasons = currentChampionship ? getSeasonsForChampionship(currentChampionship.id) : [];
  const championshipStages = currentChampionship ? getStagesForChampionship(currentChampionship.id) : [];

    // Filtrar temporadas com inscrições abertas que estão em andamento ou agendadas
  const seasonsWithOpenRegistration = useMemo(() => {
    const now = new Date();
    return championshipSeasons.filter(season => {
      // Verificar se registrationOpen é true (aceita string "true" ou boolean true)
      const isRegistrationOpen = season.registrationOpen === true || (season.registrationOpen as any) === 'true';
      if (!isRegistrationOpen) return false;
      
      const endDate = new Date(season.endDate);
      // Temporada não pode estar finalizada
      return endDate >= now;
    });
  }, [championshipSeasons]);

  // Função para redirecionar para página de inscrição
  const handleRegisterClick = (seasonSlug: string) => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const registerUrl = `${baseUrl}/registration/${seasonSlug}`;
    window.location.href = registerUrl;
  };

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
      <ChampionshipHeader 
        championship={championshipForComponents} 
        seasonsWithOpenRegistration={seasonsWithOpenRegistration}
        onRegisterClick={handleRegisterClick}
      />

      {/* Tabs - fullwidth */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-dark-900 border-b border-white/10">
          <div className="container mx-auto">
            <TabsList className="bg-transparent border-0 h-auto p-0 space-x-0">
              <TabsTrigger
                value="home"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/70 hover:text-white border-b-2 border-transparent rounded-none px-4 py-3 transition-colors"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="calendario"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/70 hover:text-white border-b-2 border-transparent rounded-none px-4 py-3 transition-colors"
              >
                Calendário
              </TabsTrigger>
              {/* Aba Classificação temporariamente escondida */}
              {/* <TabsTrigger
                value="classificacao"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/70 hover:text-white border-b-2 border-transparent rounded-none px-4 py-3 transition-colors"
              >
                Classificação
              </TabsTrigger> */}
              {/* Aba Regulamento temporariamente escondida */}
              {/* <TabsTrigger
                value="regulamento"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/70 hover:text-white border-b-2 border-transparent rounded-none px-4 py-3 transition-colors"
              >
                Regulamento
              </TabsTrigger> */}
              {/* Aba Fotos temporariamente escondida */}
              {/* <TabsTrigger
                value="fotos"
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/70 hover:text-white border-b-2 border-transparent rounded-none px-4 py-3 transition-colors"
              >
                Fotos
              </TabsTrigger> */}
            </TabsList>
          </div>
        </div>

        {/* Conteúdo das tabs - sem espaçamento superior */}
        <div>
          <TabsContent value="home" className="mt-0">
            <HomeTab 
              championship={championshipForComponents} 
              seasonsWithOpenRegistration={seasonsWithOpenRegistration}
              onRegisterClick={handleRegisterClick}
            />
          </TabsContent>

          <TabsContent value="calendario" className="mt-0">
            <CalendarioTab 
              championship={championshipForComponents} 
              onRegisterClick={handleRegisterClick}
            />
          </TabsContent>

          {/* Conteúdo da aba Classificação temporariamente escondido */}
          {/* <TabsContent value="classificacao" className="mt-0">
            <ClassificacaoTab championship={championshipForComponents} />
          </TabsContent> */}

          {/* Conteúdo da aba Regulamento temporariamente escondido */}
          {/* <TabsContent value="regulamento" className="mt-0">
            <RegulamentoTab championship={championshipForComponents} />
          </TabsContent> */}

          {/* Conteúdo da aba Fotos temporariamente escondido */}
          {/* <TabsContent value="fotos" className="mt-0">
            <FotosTab championship={championshipForComponents} />
          </TabsContent> */}
        </div>
      </Tabs>
    </motion.div>
  );
}; 