import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Button } from "brk-design-system";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "brk-design-system";
import { MapPin, Clock, Calendar, ChevronRight, Video, X, Trophy, Medal } from "lucide-react";
import { RaceTrack } from "@/services/championship.service";
import { RaceTrackInfo } from "@/components/championship/RaceTrackInfo";
import { ChampionshipTabHeader } from "@/components/championship/ChampionshipTabHeader";
import { championshipService, StageWithResults, Category, User } from "@/services/championship.service";
import { isEventToday } from "@/utils/championship.utils";

interface StageResultsProps {
  stageResults: StageWithResults['stageResults'];
  categories: Category[];
  users: User[];
}

const StageResults = ({ stageResults, categories, users }: StageResultsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRace, setSelectedRace] = useState<string>('');

  if (!stageResults || Object.keys(stageResults).length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Resultados não disponíveis</h3>
        <p className="text-muted-foreground">
          Os resultados desta etapa ainda não foram publicados.
        </p>
      </div>
    );
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? { name: user.name, nickname: user.nickname } : { name: 'Piloto não encontrado', nickname: '' };
  };

  const formatTime = (time: string) => {
    if (!time || time === '00:00.000') return '-';
    return time;
  };

  const toCamelCase = (text: string) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return null;
    }
  };

  const getPositionDifference = (startPosition: number, finishPosition: number) => {
    if (!startPosition || !finishPosition) return null;
    const difference = startPosition - finishPosition;
    if (difference === 0) return null;
    
    return {
      value: Math.abs(difference),
      gained: difference > 0,
      lost: difference < 0
    };
  };

  const formatPositionWithDifference = (result: any) => {
    if (!result?.finishPosition) return '-';
    
    const position = result.finishPosition;
    const icon = getPositionIcon(position);
    
    if (!result?.startPosition) {
      return (
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{position}</span>
        </div>
      );
    }
    
    const diff = getPositionDifference(result.startPosition, result.finishPosition);
    
    if (!diff) {
      return (
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{position}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold">{position}</span>
        <span className={`text-xs px-1 py-0.5 rounded ${
          diff.gained 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {diff.gained ? '+' : '-'}{diff.value}
        </span>
      </div>
    );
  };

  const formatPositionForMobile = (result: any) => {
    if (!result?.finishPosition) return '-';
    
    const position = result.finishPosition;
    const icon = getPositionIcon(position);
    
    if (!result?.startPosition) {
      return (
        <div className="flex items-center gap-1">
          {icon}
          <span>{position}º</span>
        </div>
      );
    }
    
    const diff = getPositionDifference(result.startPosition, result.finishPosition);
    
    if (!diff) {
      return (
        <div className="flex items-center gap-1">
          {icon}
          <span>{position}º</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        {icon}
        <span>{position}º</span>
        <span className={`text-xs px-1 rounded ${
          diff.gained 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {diff.gained ? '+' : '-'}{diff.value}
        </span>
      </div>
    );
  };

  const getBestLap = (categoryResults: any) => {
    let bestLap: string | null = null;
    let bestLapTime: number | null = null;
    
    Object.values(categoryResults).forEach((pilotResults: any) => {
      Object.values(pilotResults).forEach((result: any) => {
        if (result.bestLap && result.bestLap !== '00:00.000') {
          const timeInMs = parseTimeToMs(result.bestLap);
          if (!bestLapTime || timeInMs < bestLapTime) {
            bestLapTime = timeInMs;
            bestLap = result.bestLap;
          }
        }
      });
    });
    
    return bestLap;
  };

  const parseTimeToMs = (time: string) => {
    if (!time || time === '00:00.000') return Infinity;
    
    // Formato esperado: "01:09.457" ou "00:13:02.673"
    const parts = time.split(':');
    if (parts.length === 2) {
      // Formato "01:09.457"
      const [minutes, seconds] = parts;
      const [secs, ms] = seconds.split('.');
      return parseInt(minutes) * 60000 + parseInt(secs) * 1000 + parseInt(ms || '0');
    } else if (parts.length === 3) {
      // Formato "00:13:02.673"
      const [hours, minutes, seconds] = parts;
      const [secs, ms] = seconds.split('.');
      return parseInt(hours) * 3600000 + parseInt(minutes) * 60000 + parseInt(secs) * 1000 + parseInt(ms || '0');
    }
    
    return Infinity;
  };

  // Função para verificar se um piloto tem dados válidos
  const hasValidData = (pilotResults: any) => {
    return Object.values(pilotResults).some((result: any) => {
      // Verificar se tem tempo de volta válido
      const hasValidBestLap = result.bestLap && result.bestLap !== '00:00.000';
      // Verificar se tem tempo de classificação válido
      const hasValidQualifying = result.qualifyingBestLap && result.qualifyingBestLap !== '00:00.000';
      // Verificar se tem tempo total válido
      const hasValidTotalTime = result.totalTime && result.totalTime !== '00:00.000';
      
      return hasValidBestLap || hasValidQualifying || hasValidTotalTime;
    });
  };

  // Obter todas as categorias disponíveis
  const availableCategories = Object.keys(stageResults).map(categoryId => ({
    id: categoryId,
    name: getCategoryName(categoryId)
  }));

  // Obter todas as baterias disponíveis (0, 1, etc.)
  const availableRaces = new Set<string>();
  Object.values(stageResults).forEach(categoryResults => {
    Object.values(categoryResults).forEach(pilotResults => {
      Object.keys(pilotResults).forEach(raceNumber => {
        availableRaces.add(raceNumber);
      });
    });
  });

  // Filtrar resultados baseado nos filtros selecionados
  const filteredResults = Object.entries(stageResults)
    .filter(([categoryId]) => !selectedCategory || categoryId === selectedCategory)
    .reduce((acc, [categoryId, categoryResults]) => {
      const filteredCategoryResults = Object.entries(categoryResults as Record<string, Record<string, Record<string, any>>>)
        .filter(([, pilotResults]) => {
          // Filtrar pilotos que têm dados válidos
          return hasValidData(pilotResults);
        })
        .reduce((pilotAcc, [pilotId, pilotResults]) => {
          const filteredPilotResults = Object.entries(pilotResults as Record<string, any>)
            .filter(([raceNumber]) => !selectedRace || raceNumber === selectedRace)
            .reduce((raceAcc, [raceNumber, result]) => {
              raceAcc[raceNumber] = result as any;
              return raceAcc;
            }, {} as Record<string, any>);

          if (Object.keys(filteredPilotResults).length > 0) {
            pilotAcc[pilotId] = filteredPilotResults;
          }
          return pilotAcc;
        }, {} as Record<string, Record<string, any>>);

      if (Object.keys(filteredCategoryResults).length > 0) {
        acc[categoryId] = filteredCategoryResults;
      }
      return acc;
    }, {} as Record<string, Record<string, Record<string, any>>>);

  // Auto-selecionar primeira categoria se nenhuma estiver selecionada
  useEffect(() => {
    if (!selectedCategory && availableCategories.length > 0) {
      setSelectedCategory(availableCategories[0].id);
    }
  }, [availableCategories, selectedCategory]);

  // Auto-selecionar primeira bateria se nenhuma estiver selecionada
  useEffect(() => {
    if (!selectedRace && availableRaces.size > 0) {
      setSelectedRace(Array.from(availableRaces).sort()[0]);
    }
  }, [availableRaces, selectedRace]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Trophy className="h-5 w-5 text-primary" />
        Resultados por Categoria
      </h3>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-2 w-full sm:w-1/2">
          <label className="text-sm font-medium">Categoria</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-1/2">
          <label className="text-sm font-medium">Bateria</label>
          <Select value={selectedRace} onValueChange={setSelectedRace}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma bateria" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(availableRaces).sort().map((raceNumber) => (
                <SelectItem key={raceNumber} value={raceNumber}>
                  Bateria {parseInt(raceNumber) + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {Object.entries(filteredResults).map(([categoryId, categoryResults]) => {
        const categoryName = getCategoryName(categoryId);
        
        return (
          <div key={categoryId} className="space-y-4">
            <h4 className="text-lg font-semibold text-primary">{categoryName}</h4>
            
            <div className="space-y-4">
              {/* Desktop - Tabela */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-muted">
                        <th className="text-left p-3 font-semibold text-sm">Pos</th>
                        <th className="text-left p-3 font-semibold text-sm">Piloto</th>
                        <th className="text-center p-3 font-semibold text-sm">Grid</th>
                        <th className="text-center p-3 font-semibold text-sm">Qualificação</th>
                        <th className="text-center p-3 font-semibold text-sm">Melhor Volta</th>
                        <th className="text-center p-3 font-semibold text-sm">Tempo Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(categoryResults)
                        .map(([pilotId, pilotResults]) => {
                          const pilot = getUserName(pilotId);
                          
                          // Encontrar a posição de chegada para a bateria selecionada
                          const selectedRaceResult = pilotResults[selectedRace] as any;
                          const finishPosition = selectedRaceResult?.finishPosition || 999;
                          
                          return {
                            pilotId,
                            pilot,
                            pilotResults,
                            finishPosition,
                            result: selectedRaceResult
                          };
                        })
                        .sort((a, b) => {
                          if (a.finishPosition === null || a.finishPosition === undefined) return 1;
                          if (b.finishPosition === null || b.finishPosition === undefined) return -1;
                          return a.finishPosition - b.finishPosition;
                        })
                        .map(({ pilotId, pilot, result }) => (
                          <tr key={pilotId} className="border-b border-muted/50 hover:bg-muted/30">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {formatPositionWithDifference(result)}
                              </div>
                            </td>
                            <td className="p-3">
                              <div>
                                <div className="font-medium">{toCamelCase(pilot.name)}</div>
                                {pilot.nickname && (
                                  <div className="text-sm text-muted-foreground italic">{toCamelCase(pilot.nickname)}</div>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className="font-mono">{result?.startPosition || '-'}</span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="font-mono">
                                {result?.qualifyingBestLap && result.qualifyingBestLap !== '00:00.000' 
                                  ? formatTime(result.qualifyingBestLap) 
                                  : '-'
                                }
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <span className="font-mono">{formatTime(result?.bestLap)}</span>
                                {result?.bestLap && result.bestLap === getBestLap(categoryResults) && (
                                  <Trophy className="h-3 w-3 text-yellow-500" />
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className="font-mono">{formatTime(result?.totalTime)}</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile - Cards */}
              <div className="lg:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(categoryResults)
                    .map(([pilotId, pilotResults]) => {
                      const pilot = getUserName(pilotId);
                      
                      // Encontrar a posição de chegada para a bateria selecionada
                      const selectedRaceResult = pilotResults[selectedRace] as any;
                      const finishPosition = selectedRaceResult?.finishPosition || 999;
                      
                      return {
                        pilotId,
                        pilot,
                        pilotResults,
                        finishPosition
                      };
                    })
                    .sort((a, b) => {
                      if (a.finishPosition === null || a.finishPosition === undefined) return 1;
                      if (b.finishPosition === null || b.finishPosition === undefined) return -1;
                      return a.finishPosition - b.finishPosition;
                    })
                    .map(({ pilotId, pilot, pilotResults }) => (
                      <Card key={pilotId} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h5 className="font-semibold">{toCamelCase(pilot.name)}</h5>
                              {pilot.nickname && (
                                <p className="text-sm text-muted-foreground italic">{toCamelCase(pilot.nickname)}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                                                    {Object.entries(pilotResults).map(([raceNumber, result]) => (
                          <div key={raceNumber} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                            <div className="space-y-2 text-xs">
                              {result.finishPosition && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-primary">Pos:</span>
                                  {formatPositionForMobile(result)}
                                </div>
                              )}
                              
                              {result.startPosition && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-primary">Grid:</span>
                                  <span>{result.startPosition}º</span>
                                </div>
                              )}
                              
                              {result.qualifyingBestLap && result.qualifyingBestLap !== '00:00.000' && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-primary">Qualificação:</span>
                                  <span className="font-mono">{formatTime(result.qualifyingBestLap)}</span>
                                </div>
                              )}
                              
                              {result.bestLap && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-primary">Melhor Volta:</span>
                                  <span className="font-mono">{formatTime(result.bestLap)}</span>
                                  {result.bestLap === getBestLap(categoryResults) && (
                                    <Trophy className="h-3 w-3 text-yellow-500" />
                                  )}
                                </div>
                              )}
                              
                              {result.totalTime && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-primary">Tempo Total:</span>
                                  <span className="font-mono">{formatTime(result.totalTime)}</span>
                                </div>
                              )}
                            </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface CalendarioTabProps {
  championship: {
    currentSeason: {
      name: string;
      year: string;
      season: string;
    };
    availableSeasons?: Array<{
      id: string;
      name: string;
      startDate: string;
      endDate: string;
      championshipId: string;
    }>;
    events: Array<{
      id: number;
      date: string;
      month: string;
      day: string;
      stage: string;
      location: string; // Agora é raceTrackId
      time: string;
      status: string;
      streamLink?: string;
      briefing?: string;
      raceTrackData?: RaceTrack; // Dados do kartódromo já incluídos
      trackLayout?: any; // Dados do traçado se disponível
      seasonId?: string; // ID da temporada para buscar resultados
    }>;
  };
  onRegisterClick?: (seasonSlug: string) => void;
}

export const CalendarioTab = ({ championship, onRegisterClick }: CalendarioTabProps) => {
  // Estado para controlar o modal de detalhes
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stageResults, setStageResults] = useState<StageWithResults | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // Determinar ano inicial baseado nas temporadas disponíveis
  const getInitialYear = () => {
    if (championship?.availableSeasons && championship.availableSeasons.length > 0) {
      return new Date(championship.availableSeasons[0].startDate).getUTCFullYear().toString();
    }
    return championship?.currentSeason?.year || new Date().getFullYear().toString();
  };

  // Determinar temporada inicial baseada nas temporadas disponíveis
  const getInitialSeason = () => {
    if (championship?.availableSeasons && championship.availableSeasons.length > 0) {
      return championship.availableSeasons[0].name;
    }
    return championship?.currentSeason?.season || '';
  };

  const [selectedYear, setSelectedYear] = useState<string>(getInitialYear());
  const [selectedSeason, setSelectedSeason] = useState<string>(getInitialSeason());

  // Função para abrir detalhes da etapa
  const handleOpenEventDetails = async (event: any) => {
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
      setLoadingResults(true);
      
      try {
        // Fetch stage results
        const stageData = await championshipService.getStageWithResults(event.id);
        setStageResults(stageData);
        
        if (stageData?.stageResults) {
          // Get all categories for the season
          const allCategories = await championshipService.getAllCategories();
          const seasonCategories = allCategories.filter(cat => cat.seasonId === event.seasonId);
          setCategories(seasonCategories);
          
          // Get all users that participated in this stage
          const userIds = new Set<string>();
          Object.values(stageData.stageResults).forEach(categoryResults => {
            Object.keys(categoryResults).forEach(pilotId => {
              userIds.add(pilotId);
            });
          });
          
          if (userIds.size > 0) {
            const stageUsers = await championshipService.getUsersByIds(Array.from(userIds));
            setUsers(stageUsers);
          }
        }
      } catch (error) {
        console.error('Error fetching stage results:', error);
      } finally {
        setLoadingResults(false);
      }
    }
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setStageResults(null);
    setCategories([]);
    setUsers([]);
  };

  // Obter anos únicos das temporadas disponíveis
  const availableYears = championship?.availableSeasons 
    ? [...new Set(championship.availableSeasons.map(season => 
        new Date(season.startDate).getUTCFullYear().toString()
      ))].sort()
    : [championship?.currentSeason?.year || new Date().getFullYear().toString()];

  // Obter temporadas do ano selecionado
  const seasonsForYear = championship?.availableSeasons 
    ? championship.availableSeasons.filter(season => 
        new Date(season.startDate).getUTCFullYear().toString() === selectedYear
      )
    : [];

  // Atualizar estados quando os dados do campeonato mudarem
  useEffect(() => {
    if (championship?.availableSeasons && championship.availableSeasons.length > 0) {
      const firstSeason = championship.availableSeasons[0];
      const yearFromSeason = new Date(firstSeason.startDate).getUTCFullYear().toString();
      setSelectedYear(yearFromSeason);
      setSelectedSeason(firstSeason.name);
    }
  }, [championship?.availableSeasons]);

  // Função para converter mês em número
  const getMonthNumber = (monthName: string): number => {
    if (!monthName || typeof monthName !== 'string') return 0;
    
    const months: { [key: string]: number } = {
      'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
      'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11,
      'JANEIRO': 0, 'FEVEREIRO': 1, 'MARÇO': 2, 'ABRIL': 3, 'MAIO': 4, 'JUNHO': 5,
      'JULHO': 6, 'AGOSTO': 7, 'SETEMBRO': 8, 'OUTUBRO': 9, 'NOVEMBRO': 10, 'DEZEMBRO': 11
    };
    return months[monthName.toUpperCase()] || 0;
  };

  // Função para formatar hora no formato HH:mm
  const formatTime = (time: string): string => {
    if (!time || typeof time !== 'string') return '';
    
    // Se estiver no formato HH:mm:ss, remove os segundos
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.slice(0, 5); // Pega apenas HH:mm
    }
    
    // Se estiver no formato H:mm:ss, remove os segundos e adiciona zero à esquerda
    if (/^\d{1}:\d{2}:\d{2}$/.test(time)) {
      return `0${time.slice(0, 4)}`; // Pega H:mm e adiciona zero
    }
    
    // Se já estiver no formato HH:mm, retorna como está
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }
    
    // Se estiver no formato H:mm, adiciona zero à esquerda
    if (/^\d{1}:\d{2}$/.test(time)) {
      return `0${time}`;
    }
    
    // Se for apenas números (ex: 1400), converte para HH:mm
    if (/^\d{3,4}$/.test(time)) {
      const hours = time.length === 3 ? time.slice(0, 1) : time.slice(0, 2);
      const minutes = time.length === 3 ? time.slice(1) : time.slice(2);
      return `${hours.padStart(2, '0')}:${minutes}`;
    }
    
    // Caso padrão, retorna como está
    return time;
  };

  // Filtrar e ordenar todos os eventos por data crescente
  const filteredEvents = (championship?.events || [])
    .filter(_event => {
      if (!championship?.availableSeasons) return true;
      
      const selectedSeasonData = championship.availableSeasons.find(season => season.name === selectedSeason);
      if (!selectedSeasonData) return true;
      
      // Aqui você pode adicionar lógica mais específica para filtrar eventos por temporada
      // Por enquanto, mostramos todos os eventos
      return true;
    })
    .sort((a, b) => {
      // Criar datas mais precisas para ordenação
      const yearNum = parseInt(selectedYear) || new Date().getFullYear();
      const monthA = getMonthNumber(a.month);
      const monthB = getMonthNumber(b.month);
      const dayA = parseInt(a.date) || 1;
      const dayB = parseInt(b.date) || 1;
      
      const dateA = new Date(yearNum, monthA, dayA);
      const dateB = new Date(yearNum, monthB, dayB);
      
      return dateA.getTime() - dateB.getTime();
    });

  // Verificar se há dados válidos
  if (!championship) {
    return (
      <div className="space-y-8">
        <ChampionshipTabHeader
          icon={Calendar}
          title="Calendário do Campeonato"
          description="Acompanhe todas as etapas e datas importantes do campeonato"
        />
        <div className="container px-6">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dados não disponíveis</h3>
            <p className="text-muted-foreground">
              Os dados do campeonato não estão disponíveis no momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <ChampionshipTabHeader
        icon={Calendar}
        title="Calendário do Campeonato"
        description={`Acompanhe todas as etapas e datas importantes do ${championship.currentSeason?.name || 'campeonato'}`}
      />

      <div className="container px-6 space-y-6">

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium">Ano</label>
          <Select value={selectedYear} onValueChange={(value) => setSelectedYear(value)}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium">Temporada</label>
          <Select value={selectedSeason} onValueChange={(value) => setSelectedSeason(value)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Temporada" />
            </SelectTrigger>
            <SelectContent>
              {seasonsForYear.length > 0 ? (
                seasonsForYear.map((season) => (
                  <SelectItem key={season.id} value={season.name}>
                    {season.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={championship.currentSeason?.season || ''}>
                  {championship.currentSeason?.season || 'Temporada atual'}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Lista de Eventos - Layout de Lista */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Data */}
                  <div className="flex-shrink-0">
                    <div className="bg-primary/10 rounded-lg p-4 text-center min-w-20">
                      <div className="text-2xl font-bold text-primary">{event.date}</div>
                      <div className="text-sm text-muted-foreground uppercase font-medium">
                        {event.month}
                      </div>
                    </div>
                  </div>

                  {/* Informações principais */}
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-xl font-bold">{event.stage}</h3>
                      <Badge 
                        variant={isEventToday(event.date, event.month, selectedYear) ? "default" : "secondary"}
                        className={`w-fit ${
                          isEventToday(event.date, event.month, selectedYear) 
                            ? "bg-primary text-white" 
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isEventToday(event.date, event.month, selectedYear) ? "Hoje" : event.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">{event.day}</div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                      <RaceTrackInfo 
                        raceTrack={event.raceTrackData}
                        className="flex items-center gap-2"
                      />
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(event.time)}</span>
                      </div>
                      {event.trackLayout && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Traçado: {event.trackLayout.name}</span>
                        </div>
                      )}
                      {event.streamLink && (
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={event.streamLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Assistir transmissão
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ação */}
                  <div className="flex-shrink-0">
                    {event.status === "Inscrição Aberta" ? (
                      <Button 
                        variant="default"
                        size="sm"
                        className="w-full md:w-auto whitespace-normal text-center min-h-[36px]"
                        onClick={() => onRegisterClick?.(selectedSeason)}
                      >
                        <span className="leading-tight">Inscrever-se</span>
                        <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full md:w-auto whitespace-normal text-center min-h-[36px]"
                        onClick={() => handleOpenEventDetails(event)}
                      >
                        <span className="leading-tight">Ver Detalhes</span>
                        <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
                      </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma etapa encontrada para os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Informações adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 p-4 bg-muted/30 rounded-lg"
      >
        <h3 className="font-semibold mb-2">Informações Importantes:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• As inscrições para cada etapa abrem com antecedência</li>
          <li>• Confirmem sempre a data e horário antes de cada evento</li>
          <li>• Em caso de chuva, consulte as redes sociais para atualizações</li>
        </ul>
      </motion.div>

      {/* Modal de Detalhes da Etapa */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Detalhes da Etapa
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCloseModal}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Cabeçalho da etapa */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-primary/5 rounded-lg">
                    <div className="bg-primary/10 rounded-lg p-4 text-center min-w-20">
                      <div className="text-2xl font-bold text-primary">{selectedEvent.date}</div>
                      <div className="text-sm text-muted-foreground uppercase font-medium">
                        {selectedEvent.month}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2">{selectedEvent.stage}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge 
                          variant={isEventToday(selectedEvent.date, selectedEvent.month, selectedYear) ? "default" : "secondary"}
                          className={
                            isEventToday(selectedEvent.date, selectedEvent.month, selectedYear) 
                              ? "bg-primary text-white" 
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {isEventToday(selectedEvent.date, selectedEvent.month, selectedYear) ? "Hoje" : selectedEvent.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{selectedEvent.day}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informações detalhadas */}
                  <div className="space-y-6">
                    {/* Primeira linha: Local e Traçado */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Local</h4>
                          <RaceTrackInfo 
                            raceTrack={selectedEvent.raceTrackData}
                            showAddress={true}
                            className="p-0"
                            showIcon={false}
                          />
                        </div>
                      </div>

                      {selectedEvent.trackLayout && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-semibold">Traçado</h4>
                            <p className="text-muted-foreground">{selectedEvent.trackLayout.name}</p>
                            {selectedEvent.trackLayout.description && (
                              <p className="text-sm text-muted-foreground mt-1">{selectedEvent.trackLayout.description}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Segunda linha: Horário e Transmissão */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Horário</h4>
                          <p className="text-muted-foreground">{formatTime(selectedEvent.time)}</p>
                        </div>
                      </div>

                      {selectedEvent.streamLink && (
                        <div className="flex items-start gap-3">
                          <Video className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-semibold">Transmissão</h4>
                            <a 
                              href={selectedEvent.streamLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Assistir transmissão
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Briefing e Inscrições */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {selectedEvent.briefing && (
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-start gap-2">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            Briefing da Etapa
                          </h4>
                          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {selectedEvent.briefing}
                          </div>
                        </div>
                      )}

                      {selectedEvent.status === "Inscrição Aberta" && (
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <h4 className="font-semibold mb-2 text-primary">Inscrições Abertas!</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Garante já sua vaga nesta etapa emocionante.
                          </p>
                          <Button 
                            className="w-full whitespace-normal text-center min-h-[40px]"
                            onClick={() => onRegisterClick?.(selectedSeason)}
                          >
                            <span className="leading-tight">Inscrever-se Agora</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resultados da Etapa */}
                  {stageResults && (
                    <div className="border-t pt-6">
                      {loadingResults ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Carregando resultados...</p>
                        </div>
                      ) : (
                        <StageResults 
                          stageResults={stageResults.stageResults}
                          categories={categories}
                          users={users}
                        />
                      )}
                    </div>
                  )}

                  {/* Rodapé com ações */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={handleCloseModal}>
                      Fechar
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}; 