import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Trophy, Medal, Star, Loader2, AlertCircle, Calendar, Layers } from "lucide-react";
import { championshipService, Category, SeasonClassificationByCategoryV2, ClassificationTotalsV2 } from "@/services/championship.service";

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
  const [seasonClassification, setSeasonClassification] = useState<SeasonClassificationByCategoryV2 | null>(null);
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

  // Buscar classificação V2 da temporada (com separação por categoria) quando a temporada mudar
  useEffect(() => {
    if (!selectedSeasonId) return;

    const fetchClassification = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await championshipService.getSeasonClassificationV2(selectedSeasonId);
        setSeasonClassification(data);
      } catch (err) {
        setError("Erro ao carregar classificação");
        console.error("Failed to fetch classification V2 (by season):", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassification();
  }, [selectedSeasonId]);

  const renderPositionBadge = (position: number, size: 'md' | 'lg' = 'md') => {
    const iconSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    const textSize = size === 'lg' ? 'text-xl' : 'text-base';
    if (position === 1) {
      return (
        <div className="flex items-center justify-center gap-2 text-yellow-500">
          <Trophy className={iconSize} />
          <span className={`font-bold ${textSize}`}>1º</span>
        </div>
      );
    }
    if (position === 2) {
      return (
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Medal className={iconSize} />
          <span className={`font-bold ${textSize}`}>2º</span>
        </div>
      );
    }
    if (position === 3) {
      return (
        <div className="flex items-center justify-center gap-2 text-amber-600">
          <Medal className={iconSize} />
          <span className={`font-bold ${textSize}`}>3º</span>
        </div>
      );
    }
    return (
      <span className={`font-bold ${textSize}`}>{position}º</span>
    );
  };

  const getCurrentSeason = () => {
    return championship.availableSeasons?.find(season => season.id === selectedSeasonId);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `Categoria ${categoryId.slice(-4)}`;
  };

  // Normaliza o texto em "camel case" para exibição (título por palavra),
  // mantendo preposições comuns em minúsculas quando não forem a primeira palavra
  const toCamelCaseDisplay = (input: string): string => {
    const normalized = (input || "").toLowerCase().trim().replace(/\s+/g, " ");
    const smallWords = new Set(["de", "da", "do", "das", "dos", "e", "di", "du", "la", "le", "van", "von"]);
    return normalized
      .split(" ")
      .map((word, index) => {
        // Trata nomes compostos com hífen
        return word
          .split("-")
          .map((part) => {
            if (smallWords.has(part) && index !== 0) return part;
            return part.charAt(0).toUpperCase() + part.slice(1);
          })
          .join("-");
      })
      .join(" ");
  };

  const formatPilotNameDisplay = (pilot: { name: string; nickname: string | null }) => {
    const rawName = pilot.name || "";
    const rawNickname = pilot.nickname || null;
    const name = toCamelCaseDisplay(rawName);
    const nickname = rawNickname ? toCamelCaseDisplay(rawNickname) : null;

    if (nickname && nickname.trim() && nickname.trim() !== name.trim()) {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-black">{name}</span>
          <span className="text-sm italic text-muted-foreground">{nickname}</span>
        </div>
      );
    }
    return <span className="font-medium text-black">{name}</span>;
  };

  // Versão para mobile: quebra em até 2 linhas usando line-clamp via CSS inline
  const renderPilotNameTwoLines = (pilot: { name: string; nickname: string | null }) => {
    const rawName = pilot.name || "";
    const rawNickname = pilot.nickname || null;
    const name = toCamelCaseDisplay(rawName);
    const nickname = rawNickname ? toCamelCaseDisplay(rawNickname) : null;

    return (
      <div
        className="leading-snug break-words"
        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        <span className="font-medium text-black">{name}</span>
        {nickname && nickname.trim() && nickname.trim() !== name.trim() && (
          <span className="text-sm italic text-muted-foreground">{nickname}</span>
        )}
      </div>
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

  const getAvailableCategories = () => {
    if (!seasonClassification?.classificationsByCategory) return categories;
    const availableCategoryIds = new Set(Object.keys(seasonClassification.classificationsByCategory));
    return categories.filter(cat => availableCategoryIds.has(cat.id));
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

  if (!seasonClassification) {
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
  const selectedCategoryClassification = selectedCategoryId && seasonClassification.classificationsByCategory
    ? seasonClassification.classificationsByCategory[selectedCategoryId]
    : undefined;
  if (!selectedCategoryClassification) {
    return (
      <div className="px-6 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhuma classificação disponível</h2>
          <p className="text-muted-foreground">Selecione uma categoria com classificação disponível.</p>
        </div>
      </div>
    );
  }
  const totals: ClassificationTotalsV2[] = (selectedCategoryClassification.totals || []).slice().sort((a, b) => b.total - a.total);
  const gridByUserId = new Map((selectedCategoryClassification.grid || []).map(row => [row.userId, row]));

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
          Última atualização: {new Date(selectedCategoryClassification.generatedAt || seasonClassification.lastUpdated).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {/* Classificação por Categoria (V2) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2 text-center">
          <Star className="h-5 w-5 text-primary" />
          {getCategoryName(selectedCategoryId)}
        </h2>

        {/* Pódio - Top 3 (com base em totals) */}
        <div className="mb-6 hidden md:block">
          <div className="flex justify-between items-end gap-4 w-full">
            {totals[1] && (
              <Card className="relative ring-2 ring-gray-400 flex-1 h-48">
                <CardContent className="py-6 px-6 text-center w-full h-full flex flex-col justify-center items-center">
                  <div className="mb-3 mt-2">{renderPositionBadge(2)}</div>
                  <h3 className="font-bold text-base mb-2">{formatPilotNameDisplay(totals[1])}</h3>
                  <div className="text-xl font-bold text-primary mb-2">{totals[1].total} pts</div>
                </CardContent>
              </Card>
            )}
            {totals[0] && (
              <Card className="relative ring-2 ring-yellow-500 flex-1 h-56">
                <CardContent className="py-8 px-8 text-center w-full h-full flex flex-col justify-center items-center">
                  <div className="mb-4 mt-2">{renderPositionBadge(1)}</div>
                  <h3 className="font-bold text-xl mb-2">{formatPilotNameDisplay(totals[0])}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{totals[0].total} pts</div>
                </CardContent>
              </Card>
            )}
            {totals[2] && (
              <Card className="relative ring-2 ring-amber-600 flex-1 h-40">
                <CardContent className="py-6 px-6 text-center w-full h-full flex flex-col justify-center items-center">
                  <div className="mb-3 mt-2">{renderPositionBadge(3)}</div>
                  <h3 className="font-bold text-base mb-2">{formatPilotNameDisplay(totals[2])}</h3>
                  <div className="text-xl font-bold text-primary mb-2">{totals[2].total} pts</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mobile: Cards por piloto */}
        <div className="block md:hidden space-y-3">
          {totals.map((row, index) => {
            const gridRow = gridByUserId.get(row.userId);
            const cellById = new Map((gridRow?.cells || []).map(c => [c.key, c]));
            return (
              <Card key={row.userId}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">{renderPositionBadge(index + 1, 'lg')}</div>
                      <div className="min-w-0">{renderPilotNameTwoLines({ name: row.name, nickname: row.nickname })}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase text-muted-foreground">Pontos</div>
                      <div className="inline-flex items-baseline gap-1 rounded-md bg-primary/10 ring-1 ring-primary/20 px-2 py-1">
                        <span className="text-2xl font-extrabold text-primary leading-none">{row.total}</span>
                        <span className="text-[10px] font-semibold text-primary/80 uppercase">pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(selectedCategoryClassification.columns || []).map(col => {
                      const cell = cellById.get(col.id);
                      const hasPenalty = cell?.hadPenalty;
                      const discard = cell?.discardStage || cell?.discardBattery;
                      const cellHighlightClass = hasPenalty
                        ? "bg-rose-50 ring-1 ring-rose-200"
                        : discard
                          ? "bg-amber-50 ring-1 ring-amber-200"
                          : "bg-muted/30";
                      const titleLabel = discard && hasPenalty
                        ? "Resultado descartado e com penalidade"
                        : discard
                          ? "Resultado descartado"
                          : hasPenalty
                            ? "Resultado com penalidade"
                            : undefined;

                      return (
                        <div key={col.id} className={`rounded-md p-2 ${cellHighlightClass}`} title={titleLabel}>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                            <span className="font-medium">{col.label}</span>
                            <div className="flex items-center gap-1">
                              {discard && (
                                <span className="text-[10px] uppercase tracking-wide rounded px-1 bg-amber-100 text-amber-700 border border-amber-200">Desc.</span>
                              )}
                              {hasPenalty && (
                                <span className="text-[10px] uppercase tracking-wide rounded px-1 bg-rose-100 text-rose-700 border border-rose-200">Pen.</span>
                              )}
                            </div>
                          </div>
                          {cell ? (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-foreground/80">{cell.token}</span>
                              <span className={`${discard ? "line-through" : ""} font-medium`}>{cell.points}</span>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground text-center">-</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <div className="flex justify-end">
            <div className="text-[11px] text-muted-foreground flex items-center gap-4 mt-1">
              <div className="inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-amber-200 ring-1 ring-amber-300"></span>
                <span>Resultado descartado</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-rose-200 ring-1 ring-rose-300"></span>
                <span>Resultado com penalidade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Tabela única: Totais + Baterias/Etapas */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto relative">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-muted/50 sticky top-0 z-20">
                    <tr>
                      <th className="px-2 py-2 md:px-4 md:py-3 text-center font-medium w-[60px] sticky left-0 z-30 bg-background">Pos.</th>
                      <th className="px-2 py-2 md:px-4 md:py-3 text-left font-medium w-[220px] md:w-auto sticky left-[60px] z-30 bg-background">Piloto</th>
                      <th className="px-2 py-2 md:px-4 md:py-3 text-center font-medium w-[90px] sticky left-[280px] z-30 bg-background">Pontos</th>
                      {(selectedCategoryClassification.columns || []).map(col => (
                        <th key={col.id} className="px-2 py-2 md:px-4 md:py-3 text-center font-medium whitespace-nowrap min-w-[70px] md:min-w-[90px]">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {totals.map((row, index) => {
                      const gridRow = gridByUserId.get(row.userId);
                      const cellById = new Map((gridRow?.cells || []).map(c => [c.key, c]));
                      return (
                        <motion.tr
                          key={row.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                          className="border-b border-border hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-2 py-2 md:px-4 md:py-4 text-center w-[60px] sticky left-0 z-10 bg-background">{renderPositionBadge(index + 1)}</td>
                          <td className="px-2 py-2 md:px-4 md:py-4 w-[220px] md:w-auto sticky left-[60px] z-10 bg-background">
                            <div className="hidden md:block">{formatPilotNameDisplay({ name: row.name, nickname: row.nickname })}</div>
                            <div className="block md:hidden min-w-0">{renderPilotNameTwoLines({ name: row.name, nickname: row.nickname })}</div>
                          </td>
                          <td className="px-2 py-2 md:px-4 md:py-4 text-center w-[90px] sticky left-[280px] z-10 bg-background whitespace-nowrap">
                            <div className="font-bold text-primary">{row.total}</div>
                          </td>
                          {(selectedCategoryClassification.columns || []).map(col => {
                            const cell = cellById.get(col.id);
                            const hasPenalty = cell?.hadPenalty;
                            const discard = cell?.discardStage || cell?.discardBattery;
                            const baseTextClass = hasPenalty ? "text-destructive" : discard ? "text-muted-foreground" : "";
                            const cellHighlightClass = hasPenalty
                              ? "bg-rose-50 ring-1 ring-rose-200"
                              : discard
                                ? "bg-amber-50 ring-1 ring-amber-200"
                                : "";
                            const titleLabel = discard && hasPenalty
                              ? "Resultado descartado e com penalidade"
                              : discard
                                ? "Resultado descartado"
                                : hasPenalty
                                  ? "Resultado com penalidade"
                                  : undefined;
                            return (
                              <td
                                key={col.id}
                                className={`px-2 py-2 md:px-4 md:py-4 text-center align-middle min-w-[70px] md:min-w-[90px] ${baseTextClass} ${cellHighlightClass}`}
                                title={titleLabel}
                              >
                                {cell ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-1">
                                      {discard && (
                                        <span className="text-[10px] uppercase tracking-wide rounded px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-200">Desc.</span>
                                      )}
                                      {hasPenalty && (
                                        <span className="text-[10px] uppercase tracking-wide rounded px-1.5 py-0.5 bg-rose-100 text-rose-700 border border-rose-200">Pen.</span>
                                      )}
                                    </div>
                                    <span className="text-xs">{cell.token}</span>
                                    <span className={discard ? "font-medium line-through" : "font-medium"}>{cell.points}</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                            );
                          })}
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end mt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-4">
              <div className="inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-amber-200 ring-1 ring-amber-300"></span>
                <span>Resultado descartado</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-rose-200 ring-1 ring-rose-300"></span>
                <span>Resultado com penalidade</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 