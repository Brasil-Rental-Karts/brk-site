import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "brk-design-system";
import { Badge } from "brk-design-system";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "brk-design-system";
import { Users, User, Trophy, Calendar, Target, Weight } from "lucide-react";
import { championshipService, User as UserType } from "@/services/championship.service";
import { ChampionshipTabHeader } from "@/components/championship/ChampionshipTabHeader";

interface Category {
  id: string;
  name: string;
  seasonId: string;
  maxPilots: number;
  minimumAge: number;
  ballast: number;
  pilots: string[];
}

interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  championshipId: string;
}

interface PilotsTabProps {
  categories: Category[];
}

export const PilotsTab: React.FC<PilotsTabProps> = ({ categories }) => {
  const [usersMap, setUsersMap] = useState<Record<string, UserType>>({});
  const [seasonsMap, setSeasonsMap] = useState<Record<string, Season>>({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Função para converter nome para camelCase
  const toCamelCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Buscar dados das temporadas
  useEffect(() => {
    const fetchSeasons = async () => {
      if (categories.length === 0) return;
      
      // Coletar todos os IDs de temporadas únicos
      const allSeasonIds = new Set<string>();
      categories.forEach(category => {
        allSeasonIds.add(category.seasonId);
      });
      
      const seasonIds = Array.from(allSeasonIds);
      if (seasonIds.length === 0) return;
      
      setLoadingSeasons(true);
      try {
        const allSeasons = await championshipService.getAllSeasons();
        const seasonsMap: Record<string, Season> = {};
        allSeasons.forEach(season => {
          if (seasonIds.includes(season.id)) {
            seasonsMap[season.id] = season;
          }
        });
        setSeasonsMap(seasonsMap);
      } catch (error) {
        console.error('Failed to fetch seasons:', error);
      } finally {
        setLoadingSeasons(false);
      }
    };

    fetchSeasons();
  }, [categories]);

  // Buscar todos os usuários únicos de todas as categorias
  useEffect(() => {
    const fetchUsers = async () => {
      if (categories.length === 0) return;
      
      // Coletar todos os IDs de usuários únicos
      const allUserIds = new Set<string>();
      categories.forEach(category => {
        if (category.pilots && Array.isArray(category.pilots)) {
          category.pilots.forEach(pilotId => allUserIds.add(pilotId));
        }
      });
      
      const userIds = Array.from(allUserIds);
      if (userIds.length === 0) return;
      
      setLoadingUsers(true);
      try {
        const users = await championshipService.getUsersByIds(userIds);
        const usersMap: Record<string, UserType> = {};
        users.forEach(user => {
          usersMap[user.id] = user;
        });
        setUsersMap(usersMap);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [categories]);

  // Obter temporadas únicas com nomes
  const availableSeasons = useMemo(() => {
    const seasons = new Set<string>();
    categories.forEach(category => {
      seasons.add(category.seasonId);
    });
    return Array.from(seasons)
      .map(seasonId => ({
        id: seasonId,
        name: seasonsMap[seasonId]?.name || `Temporada ${seasonId.slice(0, 8)}...`
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [categories, seasonsMap]);

  // Definir temporada mais recente como padrão
  useEffect(() => {
    if (availableSeasons.length > 0 && selectedSeason === "") {
      setSelectedSeason(availableSeasons[0].id);
    }
  }, [availableSeasons, selectedSeason]);

  // Obter categorias únicas
  const availableCategories = useMemo(() => {
    const categoryNames = new Set<string>();
    categories.forEach(category => {
      categoryNames.add(category.name);
    });
    return Array.from(categoryNames).sort();
  }, [categories]);

  // Filtrar categorias baseado nos filtros selecionados
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const seasonMatch = selectedSeason === "" || category.seasonId === selectedSeason;
      const categoryMatch = selectedCategory === "all" || category.name === selectedCategory;
      return seasonMatch && categoryMatch;
    });
  }, [categories, selectedSeason, selectedCategory]);

  // Calcular estatísticas baseadas apenas na temporada selecionada
  const statsCategories = useMemo(() => {
    return categories.filter(category => {
      const seasonMatch = selectedSeason === "" || category.seasonId === selectedSeason;
      return seasonMatch;
    });
  }, [categories, selectedSeason]);

  const totalPilots = statsCategories.reduce((total, category) => 
    total + (category.pilots?.length || 0), 0
  );
  const totalCategories = statsCategories.length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <ChampionshipTabHeader
        icon={Users}
        title="Lista de Pilotos"
        description="Confira todos os pilotos inscritos em cada categoria do campeonato"
      />

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="container px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalPilots}</div>
              <div className="text-sm text-muted-foreground">Total de Pilotos</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalCategories}</div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="container px-6"
      >

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium">Temporada</label>
            <Select
              value={selectedSeason}
              onValueChange={setSelectedSeason}
            >
              <SelectTrigger className="w-full sm:min-w-48 px-4 py-2 rounded-lg border border-border bg-background">
                <SelectValue placeholder={loadingSeasons ? "Carregando..." : "Selecione uma temporada"} />
              </SelectTrigger>
              <SelectContent>
                {availableSeasons.map(season => (
                  <SelectItem key={season.id} value={season.id}>
                    {season.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium">Categoria</label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:min-w-48 px-4 py-2 rounded-lg border border-border bg-background">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {availableCategories.map(categoryName => (
                  <SelectItem key={categoryName} value={categoryName}>
                    {categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Lista de Categorias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="container px-6"
      >
        {filteredCategories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma categoria encontrada</h3>
              <p className="text-muted-foreground">
                Não há categorias disponíveis para os filtros selecionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category, categoryIndex) => {
              // Ordenar pilotos alfabeticamente por nome
              const sortedPilots = category.pilots && Array.isArray(category.pilots) 
                ? [...category.pilots].sort((a, b) => {
                    const userA = usersMap[a];
                    const userB = usersMap[b];
                    const nameA = userA ? toCamelCase(userA.name) : a;
                    const nameB = userB ? toCamelCase(userB.name) : b;
                    return nameA.localeCompare(nameB, 'pt-BR');
                  })
                : [];

              // Obter nome da temporada
              const seasonName = seasonsMap[category.seasonId]?.name || `Temporada ${category.seasonId.slice(0, 8)}...`;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + (categoryIndex * 0.1) }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-primary" />
                            {category.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Temporada: {seasonName}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Máx: {category.maxPilots}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {category.minimumAge}+ anos
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Weight className="h-3 w-3" />
                            {category.ballast}kg
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Pilotos ({sortedPilots.length})
                        </h4>
                      </div>
                      
                      {sortedPilots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {sortedPilots.map((pilotId, pilotIndex) => {
                            const user = usersMap[pilotId];
                            return (
                              <motion.div
                                key={pilotId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 1.2 + (categoryIndex * 0.1) + (pilotIndex * 0.05) }}
                                className="h-20"
                              >
                                <Card className="hover:shadow-md transition-shadow h-full">
                                  <CardContent className="p-4 h-full flex items-center">
                                    {loadingUsers ? (
                                      <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 bg-muted rounded-full animate-pulse flex-shrink-0"></div>
                                        <div className="space-y-1 flex-1">
                                          <div className="h-4 bg-muted rounded animate-pulse"></div>
                                          <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
                                        </div>
                                      </div>
                                    ) : user ? (
                                      <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                          <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium truncate">
                                            {toCamelCase(user.name)}
                                          </div>
                                          {user.nickname && (
                                            <div className="text-sm text-muted-foreground truncate">
                                              {user.nickname}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm text-muted-foreground truncate">
                                            {pilotId}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Usuário não encontrado
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Nenhum piloto cadastrado nesta categoria.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}; 