import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Button } from "brk-design-system";
import { Link } from "react-router-dom";
import { Trophy, Users, Calendar, MapPin, Search } from "lucide-react";
import { SearchInput } from "@/components/ui/input";

interface Championship {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  location: string;
  founded: string;
  pilots: number;
  seasons: number;
  categories: number;
  status: "active" | "upcoming" | "finished";
  image: string;
}

/**
 * Página de listagem de todos os campeonatos
 * Exibe cards com informações básicas de cada campeonato
 */
export const Championships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Dados mockados dos campeonatos
  const championships: Championship[] = [
    {
      id: "1",
      slug: "escola-da-velocidade",
      name: "Escola da Velocidade",
      shortDescription: "Onde a paixão por kart ganha forma! Copa de kart no lendário Kartódromo Beto Carrero.",
      location: "Kartódromo Beto Carrero",
      founded: "2021",
      pilots: 100,
      seasons: 6,
      categories: 4,
      status: "active",
      image: "/escola-velocidade-thumb.jpg"
    },
    {
      id: "2",
      slug: "copa-sul-brasileira",
      name: "Copa Sul Brasileira de Kart",
      shortDescription: "O maior campeonato de kart da região Sul, reunindo os melhores pilotos em disputas emocionantes.",
      location: "Kartódromo Internacional",
      founded: "2019",
      pilots: 150,
      seasons: 8,
      categories: 6,
      status: "active",
      image: "/copa-sul-thumb.jpg"
    },
    {
      id: "3",
      slug: "desafio-das-estrelas",
      name: "Desafio das Estrelas",
      shortDescription: "Campeonato exclusivo para pilotos experientes, com as melhores disputas do kartismo nacional.",
      location: "Autódromo de Interlagos",
      founded: "2020",
      pilots: 80,
      seasons: 5,
      categories: 3,
      status: "active",
      image: "/desafio-estrelas-thumb.jpg"
    },
    {
      id: "4",
      slug: "rookie-championship",
      name: "Rookie Championship",
      shortDescription: "Campeonato voltado para novos talentos do kartismo, com foco no desenvolvimento de pilotos iniciantes.",
      location: "Kartódromo Speed Park",
      founded: "2022",
      pilots: 60,
      seasons: 3,
      categories: 2,
      status: "upcoming",
      image: "/rookie-championship-thumb.jpg"
    },
    {
      id: "5",
      slug: "masters-series",
      name: "Masters Series",
      shortDescription: "Série especial para pilotos veteranos, celebrando a experiência e paixão pelo kartismo.",
      location: "Kartódromo Granja Viana",
      founded: "2018",
      pilots: 45,
      seasons: 7,
      categories: 2,
      status: "finished",
      image: "/masters-series-thumb.jpg"
    },
    {
      id: "6",
      slug: "junior-kart-league",
      name: "Junior Kart League",
      shortDescription: "Liga dedicada aos jovens talentos, formando a próxima geração de pilotos de kart.",
      location: "Kartódromo Aldeia da Serra",
      founded: "2023",
      pilots: 75,
      seasons: 2,
      categories: 3,
      status: "active",
      image: "/junior-league-thumb.jpg"
    }
  ];

  // Filtrar campeonatos baseado na busca e status
  const filteredChampionships = championships.filter(championship => {
    const matchesSearch = championship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         championship.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         championship.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || championship.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Championship["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Ativo</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500 text-white">Em Breve</Badge>;
      case "finished":
        return <Badge className="bg-gray-500 text-white">Finalizado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header da página - fullwidth sem margens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-8 mb-8 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
      >
        <div className="px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              Campeonatos
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra e participe dos melhores campeonatos de kart do Brasil. 
              Encontre a competição perfeita para o seu nível e paixão pelo kartismo.
            </p>
          </div>

          {/* Filtros e busca */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Busca */}
            <div className="flex-1">
              <SearchInput
                placeholder="Buscar campeonatos por nome, descrição ou local..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                clearable={!!searchQuery}
                onClear={() => setSearchQuery("")}
                variant="default"
                inputSize="default"
                className="w-full"
              />
            </div>

            {/* Filtro por status */}
            <div className="md:w-48">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="upcoming">Em Breve</option>
                <option value="finished">Finalizados</option>
              </select>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{championships.length}</div>
                <div className="text-sm text-muted-foreground">Total de Campeonatos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {championships.filter(c => c.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">Ativos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {championships.reduce((sum, c) => sum + c.pilots, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total de Pilotos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {championships.reduce((sum, c) => sum + c.categories, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Categorias</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Grid de campeonatos - com margens */}
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChampionships.map((championship, index) => (
            <motion.div
              key={championship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Imagem do campeonato */}
                <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
                  <img
                    src={championship.image}
                    alt={championship.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Placeholder se imagem não carregar
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3E" + championship.name + "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(championship.status)}
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Nome e descrição */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{championship.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {championship.shortDescription}
                    </p>
                  </div>

                  {/* Informações */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {championship.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Fundado em {championship.founded}
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="font-bold text-primary">{championship.pilots}</div>
                      <div className="text-xs text-muted-foreground">Pilotos</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">{championship.seasons}</div>
                      <div className="text-xs text-muted-foreground">Temporadas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">{championship.categories}</div>
                      <div className="text-xs text-muted-foreground">Categorias</div>
                    </div>
                  </div>

                  {/* Botão de ação */}
                  <Button asChild className="w-full">
                    <Link to={`/campeonato/${championship.slug}`}>
                      Ver Campeonato
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredChampionships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum campeonato encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termos de busca para encontrar campeonatos.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 