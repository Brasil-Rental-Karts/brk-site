import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Trophy, Medal, Star, Loader2, AlertCircle, Calendar, Layers } from "lucide-react";
import { championshipService, SeasonClassification, ClassificationPilot, Category } from "@/services/championship.service";

interface ClassificacaoTabProps {
  championship: {
    id: string;
    currentSeason: {
      name: string;
      year: string;
      season: string;
    };
    availableSeasons: any[];
  };
}

export const ClassificacaoTab = ({ championship }: ClassificacaoTabProps) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [classification, setClassification] = useState<SeasonClassification | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selecionar a primeira temporada disponível por padrão
  useEffect(() => {
    if (championship.availableSeasons && championship.availableSeasons.length > 0 && !selectedSeasonId) {
      setSelectedSeasonId(championship.availableSeasons[0].id);
    }
  }, [championship.availableSeasons, selectedSeasonId]);

  // Buscar categorias quando a temporada mudar
  useEffect(() => {
    if (!selectedSeasonId) return;

    const fetchCategories = async () => {
      try {
        const allCategories = await championshipService.getAllCategories();
        const seasonCategories = allCategories.filter(cat => cat.seasonId === selectedSeasonId);
        setCategories(seasonCategories);
        
        // Selecionar a primeira categoria disponível quando mudar temporada
        if (seasonCategories.length > 0) {
          setSelectedCategoryId(seasonCategories[0].id);
        } else {
          setSelectedCategoryId("");
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
        setSelectedCategoryId("");
      }
    };

    fetchCategories();
  }, [selectedSeasonId]);

  // Buscar classificação quando a temporada mudar
  useEffect(() => {
    if (!selectedSeasonId) return;

    const fetchClassification = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await championshipService.getSeasonClassification(selectedSeasonId);
        setClassification(data);
        
        // Se há categorias disponíveis mas nenhuma está selecionada, selecionar a primeira
        if (data && data.classificationsByCategory) {
          const availableCategoryIds = Object.keys(data.classificationsByCategory);
          if (availableCategoryIds.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(availableCategoryIds[0]);
          }
        }
      } catch (err) {
        setError("Erro ao carregar classificação");
        console.error("Failed to fetch classification:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassification();
  }, [selectedSeasonId, selectedCategoryId]);

  const renderPositionBadge = (position: number) => {
    if (position === 1) {
      return (
        <div className="flex items-center justify-center gap-2 text-yellow-500">
          <Trophy className="h-4 w-4" />
          <span className="font-bold text-base">1º</span>
        </div>
      );
    }
    if (position === 2) {
      return (
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Medal className="h-4 w-4" />
          <span className="font-bold text-base">2º</span>
        </div>
      );
    }
    if (position === 3) {
      return (
        <div className="flex items-center justify-center gap-2 text-amber-600">
          <Medal className="h-4 w-4" />
          <span className="font-bold text-base">3º</span>
        </div>
      );
    }
    return (
      <span className="font-bold text-base">{position}º</span>
    );
  };

  const getCurrentSeason = () => {
    return championship.availableSeasons?.find(season => season.id === selectedSeasonId);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `Categoria ${categoryId.slice(-4)}`;
  };

  const formatPilotName = (pilot: ClassificationPilot) => {
    return pilot.user.nickname || pilot.user.name;
  };

  const formatPilotNameDisplay = (pilot: ClassificationPilot) => {
    const { name, nickname } = pilot.user;
    
    if (nickname && nickname !== name) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-black">{name}</span>
          <span className="text-sm italic text-muted-foreground">{nickname}</span>
        </div>
      );
    }
    
    return (
      <span className="font-medium text-black">{name}</span>
    );
  };

  const formatSeasonName = (season: any) => {
    if (!season) return "Temporada";
    
    // Se a temporada tem um nome específico, usar ele
    if (season.name) {
      return season.name;
    }
    
    // Caso contrário, tentar extrair o ano da data de início
    if (season.startDate) {
      const year = new Date(season.startDate).getFullYear();
      return `Temporada ${year}`;
    }
    
    return "Temporada";
  };

  // Filtrar categorias para mostrar apenas as que têm classificação
  const getAvailableCategories = () => {
    if (!classification || !classification.classificationsByCategory) return [];
    
    return categories.filter(category => 
      classification.classificationsByCategory.hasOwnProperty(category.id)
    );
  };

  // Obter categorias para mostrar na classificação
  const getCategoriesToShow = () => {
    if (!classification || !classification.classificationsByCategory) return [];
    
    if (selectedCategoryId) {
      // Se uma categoria específica foi selecionada, mostrar apenas ela
      return [selectedCategoryId].filter(id => 
        classification.classificationsByCategory.hasOwnProperty(id)
      );
    }
    
    // Se nenhuma categoria está selecionada, não mostrar nada
    return [];
  };

  if (loading) {
    return (
      <div className="px-6 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando classificação...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Erro ao carregar classificação</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!classification || !classification.classificationsByCategory) {
    return (
      <div className="px-6 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhuma classificação disponível</h2>
          <p className="text-muted-foreground">A classificação ainda não foi calculada para esta temporada.</p>
        </div>
      </div>
    );
  }

  const currentSeason = getCurrentSeason();
  const availableCategories = getAvailableCategories();
  const categoriesToShow = getCategoriesToShow();

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Classificação Geral
        </h1>
        <p className="text-muted-foreground mb-6">
          Classificação dos pilotos no {currentSeason ? formatSeasonName(currentSeason) : championship.currentSeason.name}
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Temporada
          </label>
          <select 
            className="px-4 py-2 rounded-lg border border-border bg-background min-w-40 focus:ring-2 focus:ring-primary focus:border-primary transition-colors w-full"
            value={selectedSeasonId}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
          >
            {championship.availableSeasons && championship.availableSeasons.length > 0 ? (
              championship.availableSeasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {formatSeasonName(season)}
                </option>
              ))
            ) : (
              <option value="">Nenhuma temporada disponível</option>
            )}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Categoria
          </label>
          <select 
            className="px-4 py-2 rounded-lg border border-border bg-background min-w-40 focus:ring-2 focus:ring-primary focus:border-primary transition-colors w-full"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Estatísticas Gerais */}
      {/* Removido bloco de estatísticas gerais */}

      {/* Data da última atualização */}
      <div className="mb-4 text-center">
        <span className="text-sm italic text-muted-foreground">
          Última atualização: {new Date(classification.lastUpdated).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {/* Classificação por Categoria */}
      {categoriesToShow.map((categoryId, categoryIndex) => {
        const categoryClassification = classification.classificationsByCategory[categoryId];
        const categoryName = getCategoryName(categoryId);
        const top3Pilots = categoryClassification.pilots.slice(0, 3);

        return (
          <motion.div
            key={categoryId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + (categoryIndex * 0.1) }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2 text-center">
              <Star className="h-5 w-5 text-primary" />
              {categoryName}
            </h2>

            {/* Pódio - Top 3 */}
            <div className="mb-6">
              <div className="flex justify-between items-end gap-4 w-full">
                {/* 2º Lugar - Esquerda */}
                {top3Pilots[1] && (
                  <Card className="relative ring-2 ring-gray-400 flex-1 h-48">
                    <CardContent className="py-6 px-6 text-center w-full h-full flex flex-col justify-center items-center">
                      <div className="mb-3 mt-2">
                        {renderPositionBadge(2)}
                      </div>
                      <h3 className="font-bold text-base mb-2">{formatPilotNameDisplay(top3Pilots[1])}</h3>
                      <div className="text-xl font-bold text-primary mb-2">{top3Pilots[1].totalPoints} pts</div>
                    </CardContent>
                  </Card>
                )}

                {/* 1º Lugar - Centro (Mais Alto) */}
                {top3Pilots[0] && (
                  <Card className="relative ring-2 ring-yellow-500 flex-1 h-56">
                    <CardContent className="py-8 px-8 text-center w-full h-full flex flex-col justify-center items-center">
                      <div className="mb-4 mt-2">
                        {renderPositionBadge(1)}
                      </div>
                      <h3 className="font-bold text-xl mb-2">{formatPilotNameDisplay(top3Pilots[0])}</h3>
                      <div className="text-3xl font-bold text-primary mb-2">{top3Pilots[0].totalPoints} pts</div>
                    </CardContent>
                  </Card>
                )}

                {/* 3º Lugar - Direita */}
                {top3Pilots[2] && (
                  <Card className="relative ring-2 ring-amber-600 flex-1 h-40">
                    <CardContent className="py-6 px-6 text-center w-full h-full flex flex-col justify-center items-center">
                      <div className="mb-3 mt-2">
                        {renderPositionBadge(3)}
                      </div>
                      <h3 className="font-bold text-base mb-2">{formatPilotNameDisplay(top3Pilots[2])}</h3>
                      <div className="text-xl font-bold text-primary mb-2">{top3Pilots[2].totalPoints} pts</div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Classificação Completa da Categoria */}
            <div>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Pos.</th>
                          <th className="px-4 py-3 text-left font-medium">Piloto</th>
                          <th className="px-4 py-3 text-center font-medium">Pontos</th>
                          <th className="px-4 py-3 text-center font-medium">Vitórias</th>
                          <th className="px-4 py-3 text-center font-medium">Pódios</th>
                          <th className="px-4 py-3 text-center font-medium">Poles</th>
                          <th className="px-4 py-3 text-center font-medium">Voltas Ráp.</th>
                          <th className="px-4 py-3 text-center font-medium">Melhor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryClassification.pilots.map((piloto, index) => (
                          <motion.tr
                            key={piloto.user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                            className="border-b border-border hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-4 text-center">
                              {renderPositionBadge(index + 1)}
                            </td>
                            <td className="px-4 py-4">
                              <div>{formatPilotNameDisplay(piloto)}</div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div className="font-bold text-primary">{piloto.totalPoints}</div>
                            </td>
                            <td className="px-4 py-4 text-center">{piloto.wins}</td>
                            <td className="px-4 py-4 text-center">{piloto.podiums}</td>
                            <td className="px-4 py-4 text-center">{piloto.polePositions}</td>
                            <td className="px-4 py-4 text-center">{piloto.fastestLaps}</td>
                            <td className="px-4 py-4 text-center">{piloto.bestPosition}º</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}; 