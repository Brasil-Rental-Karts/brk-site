import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "brk-design-system";
import { ChampionshipHeader } from "@/components/championship/ChampionshipHeader";
import { HomeTab } from "@/components/championship/tabs/HomeTab";
import { CalendarioTab } from "@/components/championship/tabs/CalendarioTab";
import { ClassificacaoTab } from "@/components/championship/tabs/ClassificacaoTab";
import { RegulamentoTab } from "@/components/championship/tabs/RegulamentoTab";
import { FotosTab } from "@/components/championship/tabs/FotosTab";
// import { useClub } from "@/contexts/ClubContext";

/**
 * Página principal do campeonato (Escola da Velocidade)
 * Exibe as informações detalhadas do campeonato principal
 * com tabs para diferentes seções conforme o layout fornecido
 */
export const Championship = () => {
  const [activeTab, setActiveTab] = useState("home");
  // const { selectedClub } = useClub();

  // Dados mockados do campeonato baseados na imagem fornecida
  const championship = {
    id: "escola-velocidade",
    name: "Escola da Velocidade",
    description: "Onde a paixão por kart ganha forma!",
    founded: "2021",
    pilots: "100",
    seasons: "6", 
    categories: "4",
    kartodromo: "Kartódromo Beto Carrero",
    longDescription: `A Escola da Velocidade é uma copa de kart que vem acelerando 
    corações há 3 anos no lendário Kartódromo Beto Carrero, reunindo 
    pilotos de todas as idades e níveis de experiência em disputas 
    eletrizantes. Com um ambiente que une competição saudável, 
    aprendizado e adrenalina, o campeonato se consolida como 
    referência para quem quer evoluir no kartismo e viver a verdadeira 
    emoção das pistas.`,
    stats: [
      { label: "FUNDAÇÃO", value: "2021" },
      { label: "PILOTOS", value: "100" },
      { label: "TEMPORADAS", value: "6" },
      { label: "CATEGORIAS", value: "4" }
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
        location: "Kartódromo Beto Carrero",
        time: "A partir das 14h",
        status: "Inscrição Aberta"
      },
      {
        id: 2,
        date: "14",
        month: "jun", 
        day: "Sábado",
        stage: "Etapa JFK",
        location: "Kartódromo Beto Carrero",
        time: "A partir das 14h",
        status: "Programado"
      },
      {
        id: 3,
        date: "14",
        month: "jun",
        day: "Sábado", 
        stage: "Etapa JFK",
        location: "Kartódromo Beto Carrero",
        time: "A partir das 14h",
        status: "Programado"
      },
      {
        id: 4,
        date: "14",
        month: "jun",
        day: "Sábado",
        stage: "Etapa JFK", 
        location: "Kartódromo Beto",
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
    <div className="min-h-screen bg-background">
      {/* Header do campeonato */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
      >
        <ChampionshipHeader championship={championship} />
      </motion.div>

      {/* Sistema de tabs unificado */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        {/* Seção das tabs com fundo escuro */}
        <div className="bg-dark-900 border-b border-white/10 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="container mx-auto px-4">
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
              <TabsTrigger 
                value="classificacao" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/70 hover:text-white border-b-2 border-transparent rounded-none px-4 py-3 transition-colors"
              >
                Classificação
              </TabsTrigger>
              <TabsTrigger 
                value="regulamento" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/70 hover:text-white border-b-2 border-transparent rounded-none px-4 py-3 transition-colors"
              >
                Regulamento
              </TabsTrigger>
              <TabsTrigger 
                value="fotos" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-white/70 hover:text-white border-b-2 border-transparent rounded-none px-4 py-3 transition-colors"
              >
                Fotos
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Conteúdo das tabs com espaçamento fixo */}
        <div className="container mx-auto px-4 pt-6">
          <TabsContent value="home" className="mt-0 ring-0 focus-visible:outline-none">
            <HomeTab championship={championship} />
          </TabsContent>

          <TabsContent value="calendario" className="mt-0 ring-0 focus-visible:outline-none">
            <CalendarioTab championship={championship} />
          </TabsContent>

          <TabsContent value="classificacao" className="mt-0 ring-0 focus-visible:outline-none">
            <ClassificacaoTab championship={championship} />
          </TabsContent>

          <TabsContent value="regulamento" className="mt-0 ring-0 focus-visible:outline-none">
            <RegulamentoTab championship={championship} />
          </TabsContent>

          <TabsContent value="fotos" className="mt-0 ring-0 focus-visible:outline-none">
            <FotosTab championship={championship} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}; 