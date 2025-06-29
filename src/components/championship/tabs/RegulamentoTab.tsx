import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { BookOpen, Calendar, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight, List, Search, Menu, X } from "lucide-react";
import { Regulation, Season } from "@/services/championship.service";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RegulamentoTabProps {
  championship: {
    id: string;
    name: string;
    currentSeason: {
      name: string;
    };
  };
  getRegulationsBySeasonForChampionship: (championshipId: string) => Promise<{ season: Season; regulations: Regulation[] }[]>;
}

export const RegulamentoTab = ({ championship, getRegulationsBySeasonForChampionship }: RegulamentoTabProps) => {
  const [regulationsBySeason, setRegulationsBySeason] = useState<{ season: Season; regulations: Regulation[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSeasons, setExpandedSeasons] = useState<Set<string>>(new Set());
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedRegulationIndex, setSelectedRegulationIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? false : true));
  const [selected, setSelected] = useState<{ seasonId: string; regulationIndex: number } | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRegulations();
  }, [championship.id]);

  // Temporadas disponíveis
  const availableSeasons = useMemo(() => regulationsBySeason.map(s => s.season), [regulationsBySeason]);

  // Temporada selecionada
  const currentSeasonData = useMemo(() =>
    regulationsBySeason.find(s => s.season.id === selectedSeasonId),
    [regulationsBySeason, selectedSeasonId]
  );

  // Busca e filtro (apenas para a temporada selecionada)
  const filteredRegulations = useMemo(() => {
    if (!currentSeasonData) return [];
    const filtered = search
      ? currentSeasonData.regulations.filter(r =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.content.toLowerCase().includes(search.toLowerCase())
        )
      : currentSeasonData.regulations;
    return [{ season: currentSeasonData.season, regulations: filtered }];
  }, [currentSeasonData, search]);

  // Selecionar temporada vigente por padrão ao carregar
  useEffect(() => {
    if (!selectedSeasonId && availableSeasons.length > 0) {
      // Tenta encontrar a temporada vigente pelo nome
      const current = availableSeasons.find(s => s.name === championship.currentSeason.name);
      setSelectedSeasonId(current ? current.id : availableSeasons[0].id);
    }
  }, [selectedSeasonId, availableSeasons, championship.currentSeason.name]);

  // Sempre selecionar a primeira seção disponível se nada estiver selecionado
  useEffect(() => {
    if (!selected && filteredRegulations.length > 0) {
      const firstSeason = filteredRegulations[0];
      if (firstSeason && firstSeason.regulations.length > 0) {
        const realIndex = currentSeasonData ? currentSeasonData.regulations.findIndex(r => r.id === firstSeason.regulations[0].id) : 0;
        setSelected({ seasonId: firstSeason.season.id, regulationIndex: realIndex });
      }
    }
  }, [filteredRegulations, selected, currentSeasonData]);

  const loadRegulations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRegulationsBySeasonForChampionship(championship.id);
      setRegulationsBySeason(data);
      
      // Expandir automaticamente a primeira temporada se houver apenas uma
      if (data.length === 1) {
        setExpandedSeasons(new Set([data[0].season.id]));
        setSelectedSeason(data[0].season.id);
      }
    } catch (err) {
      setError('Erro ao carregar regulamentos');
      console.error('Error loading regulations:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeason = (seasonId: string) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(seasonId)) {
      newExpanded.delete(seasonId);
      if (selectedSeason === seasonId) {
        setSelectedSeason(null);
        setSelectedRegulationIndex(0);
      }
    } else {
      newExpanded.add(seasonId);
      setSelectedSeason(seasonId);
      setSelectedRegulationIndex(0);
    }
    setExpandedSeasons(newExpanded);
  };

  const selectRegulation = (seasonId: string, regulationIndex: number) => {
    setSelectedSeason(seasonId);
    setSelectedRegulationIndex(regulationIndex);
  };

  const navigateToNext = () => {
    if (!selectedSeason) return;
    
    const currentSeason = regulationsBySeason.find(s => s.season.id === selectedSeason);
    if (!currentSeason) return;

    if (selectedRegulationIndex < currentSeason.regulations.length - 1) {
      setSelectedRegulationIndex(selectedRegulationIndex + 1);
    } else {
      // Ir para a próxima temporada
      const currentSeasonIndex = regulationsBySeason.findIndex(s => s.season.id === selectedSeason);
      if (currentSeasonIndex < regulationsBySeason.length - 1) {
        const nextSeason = regulationsBySeason[currentSeasonIndex + 1];
        setSelectedSeason(nextSeason.season.id);
        setSelectedRegulationIndex(0);
        setExpandedSeasons(prev => new Set([...prev, nextSeason.season.id]));
      }
    }
  };

  const navigateToPrevious = () => {
    if (!selectedSeason) return;
    
    if (selectedRegulationIndex > 0) {
      setSelectedRegulationIndex(selectedRegulationIndex - 1);
    } else {
      // Ir para a temporada anterior
      const currentSeasonIndex = regulationsBySeason.findIndex(s => s.season.id === selectedSeason);
      if (currentSeasonIndex > 0) {
        const prevSeason = regulationsBySeason[currentSeasonIndex - 1];
        setSelectedSeason(prevSeason.season.id);
        setSelectedRegulationIndex(prevSeason.regulations.length - 1);
        setExpandedSeasons(prev => new Set([...prev, prevSeason.season.id]));
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentRegulation = () => {
    if (!selectedSeason) return null;
    const currentSeason = regulationsBySeason.find(s => s.season.id === selectedSeason);
    return currentSeason?.regulations[selectedRegulationIndex] || null;
  };

  const getCurrentSeason = () => {
    return regulationsBySeason.find(s => s.season.id === selectedSeason);
  };

  const canNavigateNext = () => {
    if (!selectedSeason) return false;
    const currentSeason = getCurrentSeason();
    if (!currentSeason) return false;
    
    if (selectedRegulationIndex < currentSeason.regulations.length - 1) return true;
    
    const currentSeasonIndex = regulationsBySeason.findIndex(s => s.season.id === selectedSeason);
    return currentSeasonIndex < regulationsBySeason.length - 1;
  };

  const canNavigatePrevious = () => {
    if (!selectedSeason) return false;
    
    if (selectedRegulationIndex > 0) return true;
    
    const currentSeasonIndex = regulationsBySeason.findIndex(s => s.season.id === selectedSeason);
    return currentSeasonIndex > 0;
  };

  // Seleção atual
  const current = selected
    ? regulationsBySeason.find(s => s.season.id === selected.seasonId)?.regulations[selected.regulationIndex] || null
    : null;
  const currentSeason = selected
    ? regulationsBySeason.find(s => s.season.id === selected.seasonId)?.season
    : null;

  // Navegação
  const goTo = (seasonId: string, regulationIndex: number) => setSelected({ seasonId, regulationIndex });
  const goNext = () => {
    if (!selected) return;
    const seasonIdx = regulationsBySeason.findIndex(s => s.season.id === selected.seasonId);
    const regs = regulationsBySeason[seasonIdx]?.regulations || [];
    if (selected.regulationIndex < regs.length - 1) {
      setSelected({ seasonId: selected.seasonId, regulationIndex: selected.regulationIndex + 1 });
    } else if (seasonIdx < regulationsBySeason.length - 1) {
      setSelected({ seasonId: regulationsBySeason[seasonIdx + 1].season.id, regulationIndex: 0 });
    }
  };
  const goPrev = () => {
    if (!selected) return;
    const seasonIdx = regulationsBySeason.findIndex(s => s.season.id === selected.seasonId);
    if (selected.regulationIndex > 0) {
      setSelected({ seasonId: selected.seasonId, regulationIndex: selected.regulationIndex - 1 });
    } else if (seasonIdx > 0) {
      const prevRegs = regulationsBySeason[seasonIdx - 1].regulations;
      setSelected({ seasonId: regulationsBySeason[seasonIdx - 1].season.id, regulationIndex: prevRegs.length - 1 });
    }
  };

  // Scroll para item selecionado
  useEffect(() => {
    if (!sidebarRef.current || !selected) return;
    const el = sidebarRef.current.querySelector(
      `[data-sid='${selected.seasonId}'][data-idx='${selected.regulationIndex}']`
    ) as HTMLElement | null;
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selected, sidebarOpen]);

  // Responsividade: sidebar overlay em mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (loading) {
    return (
      <div className="px-6 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Regulamento
          </h1>
          <p className="text-muted-foreground mb-6">
            Carregando regulamentos...
          </p>
        </motion.div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Regulamento
          </h1>
          <p className="text-muted-foreground mb-6">
            Regulamento oficial do {championship.currentSeason.name}
          </p>
        </motion.div>
        
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={loadRegulations}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (regulationsBySeason.length === 0) {
    return (
      <div className="px-6 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Regulamento
          </h1>
          <p className="text-muted-foreground mb-6">
            Regulamento oficial do {championship.currentSeason.name}
          </p>
        </motion.div>
        
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum regulamento encontrado</h3>
          <p className="text-muted-foreground">
            Este campeonato ainda não possui regulamentos publicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[500px] bg-background">
      {/* Sidebar */}
      <div
        className={`fixed z-40 md:static top-[64px] md:top-0 left-0 h-full md:h-auto transition-all duration-300
          ${sidebarOpen ? 'translate-x-0 w-11/12 max-w-xs' : '-translate-x-full w-0'}
          md:translate-x-0 md:w-72
          bg-white border-r border-border shadow-lg overflow-hidden
          max-h-screen md:max-h-[calc(100vh-120px)]
        `}
        aria-label="Índice do regulamento"
        ref={sidebarRef}
        style={{ minWidth: sidebarOpen ? (window.innerWidth < 768 ? '90vw' : 288) : 0 }}
      >
        <div className="px-4 py-2">
          <div className="relative">
            <input
              type="text"
              className="w-full rounded border border-border py-3 pl-12 pr-3 bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Buscar no regulamento..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar no regulamento"
            />
            <Search className="absolute left-3 top-3 h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-2" role="navigation">
          {filteredRegulations.length === 0 && (
            <div className="text-muted-foreground text-base px-2 py-4">Nenhuma seção encontrada.</div>
          )}
          {currentSeasonData && filteredRegulations[0] && (
            <div key={currentSeasonData.season.id} className="mb-4">
              <ul className="space-y-2 md:space-y-1">
                {filteredRegulations[0].regulations.map((reg, idx) => {
                  const realIndex = currentSeasonData.regulations.findIndex(r => r.id === reg.id);
                  const isActive = selected && selected.seasonId === currentSeasonData.season.id && selected.regulationIndex === realIndex;
                  return (
                    <li key={reg.id}>
                      <button
                        data-sid={currentSeasonData.season.id}
                        data-idx={realIndex}
                        onClick={() => {
                          goTo(currentSeasonData.season.id, realIndex);
                          if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 md:px-2 md:py-2 md:gap-2 rounded-lg transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary border border-transparent text-base md:text-sm
                          ${isActive
                            ? "bg-primary text-primary-foreground font-bold border-primary shadow"
                            : "hover:bg-accent text-foreground"
                        }`}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <span className={`w-8 h-8 md:w-6 md:h-6 flex items-center justify-center rounded-full text-base md:text-xs font-bold ${isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`}>{reg.order}</span>
                        <span className="truncate">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <>{children}</>,
                              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                            }}
                          >
                            {reg.title}
                          </ReactMarkdown>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>
      </div>
      {/* Overlay para mobile */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div className="fixed inset-0 z-30 bg-black/60" onClick={() => setSidebarOpen(false)} aria-label="Fechar índice" />
      )}
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="px-4 py-3 border-b bg-background sticky top-0 z-10 md:px-6 md:py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden p-3 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir índice"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                onClick={goPrev}
                disabled={!selected || (selected && selected.regulationIndex === 0)}
                className="mr-2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            </div>
            <div className="flex flex-col items-center flex-1 w-full px-2 md:px-0">
              {/* Dropdown de seleção de temporada */}
              {availableSeasons.length > 0 && (
                <select
                  className="w-full md:w-auto text-primary font-semibold text-base md:text-lg border border-border rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedSeasonId || ''}
                  onChange={e => {
                    setSelectedSeasonId(e.target.value);
                    setSelected(null); // Limpa seleção ao trocar temporada
                  }}
                >
                  {availableSeasons.map(season => (
                    <option key={season.id} value={season.id}>{season.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goNext}
                disabled={!selected || (selected && currentSeasonData && selected.regulationIndex === currentSeasonData.regulations.length - 1)}
                className="ml-2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Próximo"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 bg-background" style={{maxHeight: 'calc(100vh - 120px)'}}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground text-lg">Carregando regulamento...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <span className="text-destructive text-lg">{error}</span>
              <button onClick={loadRegulations} className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">Tentar novamente</button>
            </div>
          ) : !current ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground text-lg">Selecione uma seção do regulamento no índice.</span>
            </div>
          ) : (
            <article className="prose prose-sm max-w-3xl mx-auto">
              <h2 className="text-primary font-bold text-xl mb-2 flex items-center gap-2">
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">{current.order}</span>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <>{children}</>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                  }}
                >
                  {current.title}
                </ReactMarkdown>
              </h2>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-2 first:mt-0">{children}</h3>,
                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                  pre: ({ children }) => <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto mb-3">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-primary/30 pl-3 italic text-muted-foreground mb-3">{children}</blockquote>,
                  table: ({ children }) => <div className="overflow-x-auto mb-3"><table className="min-w-full border-collapse border border-border">{children}</table></div>,
                  th: ({ children }) => <th className="border border-border px-2 py-1 bg-muted font-semibold text-left">{children}</th>,
                  td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,
                }}
              >
                {current.content}
              </ReactMarkdown>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}; 