import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "brk-design-system";
import { ChampionshipHeader } from "@/components/championship/ChampionshipHeader";
import { HomeTab } from "@/components/championship/tabs/HomeTab";
import { CalendarioTab } from "@/components/championship/tabs/CalendarioTab";
import { ClassificacaoTab } from "@/components/championship/tabs/ClassificacaoTab";
import { RegulamentoTab } from "@/components/championship/tabs/RegulamentoTab";
import { FotosTab } from "@/components/championship/tabs/FotosTab";

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

  // Dados mockados dos campeonatos (em uma aplicação real, viria de uma API)
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

  // Buscar o campeonato pelo slug
  const championship = championshipsData.find(c => c.slug === slug);

  // Se o campeonato não for encontrado, redirecionar para a página de listagem
  if (!championship) {
    return <Navigate to="/campeonatos" replace />;
  }

  // Criar objeto no formato esperado pelos componentes
  const championshipForComponents = {
    id: championship.id,
    name: championship.name,
    description: championship.description,
    founded: championship.founded,
    pilots: championship.pilots.toString(),
    seasons: championship.seasons.toString(),
    categories: championship.categories.toString(),
    kartodromo: championship.location,
    longDescription: `A ${championship.name} é uma copa de kart que vem acelerando 
    corações há ${new Date().getFullYear() - parseInt(championship.founded)} anos no lendário ${championship.location}, reunindo 
    pilotos de todas as idades e níveis de experiência em disputas 
    eletrizantes. Com um ambiente que une competição saudável, 
    aprendizado e adrenalina, o campeonato se consolida como 
    referência para quem quer evoluir no kartismo e viver a verdadeira 
    emoção das pistas.`,
    stats: [
      { label: "FUNDAÇÃO", value: championship.founded },
      { label: "PILOTOS", value: championship.pilots.toString() },
      { label: "TEMPORADAS", value: championship.seasons.toString() },
      { label: "CATEGORIAS", value: championship.categories.toString() }
    ],
    currentSeason: {
      name: "2025 - Temporada 1",
      year: "2025",
      season: "Temporada 1"
    },
    events: [
      {
        id: 1,
        date: "14",
        month: "jun",
        day: "Sábado",
        stage: "Etapa JFK",
        location: championship.location,
        time: "A partir das 14h",
        status: "Inscrição Aberta"
      },
      {
        id: 2,
        date: "21",
        month: "jun", 
        day: "Sábado",
        stage: "Etapa Speed",
        location: championship.location,
        time: "A partir das 14h",
        status: "Programado"
      },
      {
        id: 3,
        date: "28",
        month: "jun",
        day: "Sábado", 
        stage: "Etapa Final",
        location: championship.location,
        time: "A partir das 14h",
        status: "Programado"
      }
    ],
    sponsors: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Patrocinador ${i + 1}`,
      logo: "/patrocinador-placeholder.png"
    }))
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header e Tabs com largura total */}
      <div className="-mx-6 -mt-8">
        {/* Header do campeonato */}
        <ChampionshipHeader championship={championshipForComponents} />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none bg-dark-900 border-b border-border h-12">
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

          {/* Conteúdo das tabs */}
          <div className="px-6 py-8">
            <TabsContent value="home" className="mt-0">
              <HomeTab championship={championshipForComponents} />
            </TabsContent>

            <TabsContent value="calendario" className="mt-0">
              <CalendarioTab championship={championshipForComponents} />
            </TabsContent>

            <TabsContent value="classificacao" className="mt-0">
              <ClassificacaoTab championship={championshipForComponents} />
            </TabsContent>

            <TabsContent value="regulamento" className="mt-0">
              <RegulamentoTab championship={championshipForComponents} />
            </TabsContent>

            <TabsContent value="fotos" className="mt-0">
              <FotosTab championship={championshipForComponents} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
}; 