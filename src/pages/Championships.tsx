import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, PageHeader } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Button } from "brk-design-system";
import { Link } from "react-router-dom";
import {
  Trophy,
  Search,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { SearchInput } from "@/components/ui/input";
import { useChampionships } from "@/hooks/useChampionships";
import {
  mapApiChampionshipToUI,
  filterChampionshipsByStatus,
  searchChampionships,
  calculateChampionshipStats,
  type ChampionshipUI,
} from "@/utils/championship.utils";

/**
 * Página de listagem de todos os campeonatos
 * Exibe cards com informações básicas de cada campeonato
 */
export const Championships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Buscar dados dos campeonatos da API
  const {
    championships: apiChampionships,
    loading,
    error,
    refetch,
    getActiveSeasonsCount,
    getActiveCategoriesCount,
  } = useChampionships();

  // Converter dados da API para o formato do UI
  const championships = useMemo(() => {
    return apiChampionships.map((apiChampionship) => {
      const activeSeasonsCount = getActiveSeasonsCount(apiChampionship.id);
      const activeCategoriesCount = getActiveCategoriesCount(
        apiChampionship.id
      );
      return mapApiChampionshipToUI(
        apiChampionship,
        activeSeasonsCount,
        activeCategoriesCount
      );
    });
  }, [apiChampionships, getActiveSeasonsCount, getActiveCategoriesCount]);

  // Filtrar campeonatos baseado na busca e status
  const filteredChampionships = useMemo(() => {
    let filtered = filterChampionshipsByStatus(championships, filterStatus);
    filtered = searchChampionships(filtered, searchQuery);
    return filtered;
  }, [championships, filterStatus, searchQuery]);

  // Calcular estatísticas
  const stats = useMemo(
    () => calculateChampionshipStats(championships),
    [championships]
  );

  const getStatusBadge = (status: ChampionshipUI["status"]) => {
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
        className="container flex-1"
      >
        <div>
          <PageHeader
            icon={<Trophy className="h-8 w-8 text-primary" />}
            title="Campeonatos"
            subtitle=" Descubra e participe dos melhores campeonatos de kart do Brasil. Encontre a competição perfeita para o seu nível e paixão pelo kartismo."
          />

          {/* Filtros e busca */}
          <div className="flex flex-col md:flex-row gap-4 my-8 ">
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
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total de Campeonatos
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.active}
                </div>
                <div className="text-sm text-muted-foreground">
                  Campeonatos Ativos
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.totalActiveSeasons}
                </div>
                <div className="text-sm text-muted-foreground">
                  Temporadas Ativas
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats.totalActiveCategories}
                </div>
                <div className="text-sm text-muted-foreground">
                  Categorias Ativas
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Grid de campeonatos - com margens */}
      <div className="px-6">
        {/* Estado de loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Carregando campeonatos...
            </span>
          </div>
        )}

        {/* Estado de erro */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Erro ao carregar campeonatos
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Tentar novamente
            </Button>
          </motion.div>
        )}

        {/* Grid de campeonatos */}
        {!loading && !error && (
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
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3E" +
                          championship.name +
                          "%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(championship.status)}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Nome e descrição */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">
                        {championship.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {championship.shortDescription}
                      </p>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="font-bold text-primary">
                          {championship.activeSeasons || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Temporadas Ativas
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-primary">
                          {championship.activeCategories || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Categorias Ativas
                        </div>
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
        )}

        {/* Mensagem quando não há resultados */}
        {!loading && !error && filteredChampionships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum campeonato encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou termos de busca para encontrar
              campeonatos.
            </p>
            <div className="my-8">
            <p>Não encontrou seu campeonato?</p>
            <Button
              asChild
              size="lg"
              variant="default"
              className="px-8 py-6 rounded-full transition-all duration-300"
            >
              <Link to="/">Entre em Contato</Link>
            </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
