import { useState, useEffect, useRef, useMemo } from "react";
import { BookOpen, Loader2, ChevronLeft, ChevronRight, Search, Menu} from "lucide-react";
import { Regulation, Season } from "@/services/championship.service";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChampionshipTabHeader } from "@/components/championship/ChampionshipTabHeader";

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
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [selected, setSelected] = useState<{ seasonId: string; regulationIndex: number } | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (championship?.id) {
      loadRegulations();
    }
  }, [championship?.id]);

  // Temporadas disponíveis
  const availableSeasons = useMemo(() => {
    if (!regulationsBySeason || regulationsBySeason.length === 0) return [];
    return regulationsBySeason.map(s => s.season).filter(Boolean);
  }, [regulationsBySeason]);

  // Temporada selecionada
  const currentSeasonData = useMemo(() => {
    if (!regulationsBySeason || !selectedSeasonId) return null;
    return regulationsBySeason.find(s => s.season.id === selectedSeasonId) || null;
  }, [regulationsBySeason, selectedSeasonId]);

  // Verifica se a temporada selecionada tem regulamento habilitado
  const regulationsEnabled = currentSeasonData?.season?.regulationsEnabled !== false;

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
      const current = availableSeasons.find(s => s.name === championship?.currentSeason?.name);
      setSelectedSeasonId(current ? current.id : availableSeasons[0].id);
    }
  }, [selectedSeasonId, availableSeasons, championship?.currentSeason?.name]);

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
    if (!championship?.id) {
      setError('ID do campeonato não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getRegulationsBySeasonForChampionship(championship.id);
      setRegulationsBySeason(data || []);
      
    } catch (err) {
      console.error('Error loading regulations:', err);
      setError('Erro ao carregar regulamentos');
    } finally {
      setLoading(false);
    }
  };

  // Seleção atual
  const current = selected
    ? regulationsBySeason.find(s => s.season.id === selected.seasonId)?.regulations[selected.regulationIndex] || null
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
    const navElement = sidebarRef.current.querySelector('nav') as HTMLElement | null;
    if (!navElement) return;
    
    const el = navElement.querySelector(
      `[data-sid='${selected.seasonId}'][data-idx='${selected.regulationIndex}']`
    ) as HTMLElement | null;
    if (el) {
      // Para o último item, usar "end" para garantir que seja visível
      const isLastItem = selected.regulationIndex === (currentSeasonData?.regulations.length || 0) - 1;
      el.scrollIntoView({ 
        block: isLastItem ? "end" : "nearest", 
        behavior: "smooth" 
      });
    }
  }, [selected, sidebarOpen, currentSeasonData]);

  if (loading) {
    return (
      <div className="space-y-8">
        <ChampionshipTabHeader
          icon={BookOpen}
          title="Regulamento"
          description="Consulte o regulamento oficial do campeonato e das temporadas."
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <ChampionshipTabHeader
          icon={BookOpen}
          title="Regulamento"
          description="Consulte o regulamento oficial do campeonato e das temporadas."
        />
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar regulamento</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
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

  if (!regulationsBySeason || regulationsBySeason.length === 0) {
    return (
      <div className="space-y-8">
        <ChampionshipTabHeader
          icon={BookOpen}
          title="Regulamento"
          description="Consulte o regulamento oficial do campeonato e das temporadas."
        />
        <div className="container px-6">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum regulamento encontrado</h3>
            <p className="text-muted-foreground">
              Este campeonato ainda não possui regulamentos publicados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!regulationsEnabled) {
    return (
      <div className="space-y-8">
        <ChampionshipTabHeader
          icon={BookOpen}
          title="Regulamento"
          description="Consulte o regulamento oficial do campeonato e das temporadas."
        />
        <div className="container px-6">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum regulamento cadastrado</h3>
            <p className="text-muted-foreground">
              Esta temporada não possui regulamento cadastrado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ChampionshipTabHeader
        icon={BookOpen}
        title="Regulamento"
        description="Consulte o regulamento oficial do campeonato e das temporadas."
      />
      <div className="container px-6">
        <div className="relative flex h-[calc(100vh-200px)] min-h-[500px] bg-background rounded-lg shadow-sm border border-border overflow-hidden">
          {/* Sidebar */}
          <div
            className={`fixed z-50 md:static top-0 md:top-0 left-0 h-screen md:h-auto transition-all duration-300
              ${sidebarOpen ? 'translate-x-0 w-11/12 max-w-xs' : '-translate-x-full w-0'}
              md:translate-x-0 md:w-72
              bg-background border-r border-border
              max-h-screen md:max-h-[calc(100vh-200px)]
              flex flex-col
              ${sidebarOpen ? 'block' : 'hidden md:block'}
            `}
            aria-label="Índice do regulamento"
            ref={sidebarRef}
            style={{ minWidth: sidebarOpen ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '90vw' : 288) : 0 }}
          >
            {/* Header com busca */}
            <div className="flex-shrink-0 px-4 py-4 md:py-3 border-b border-border">
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-md border border-border py-2 pl-10 pr-3 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Buscar no regulamento..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Buscar no regulamento"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            {/* Navegação com scroll */}
            <nav className="flex-1 overflow-y-auto min-h-0" role="navigation">
              <div className="px-3 py-3 pb-8 md:pb-6">
                {filteredRegulations.length === 0 && (
                  <div className="text-muted-foreground text-sm px-2 py-4">Nenhuma seção encontrada.</div>
                )}
                {currentSeasonData && filteredRegulations[0] && (
                  <div key={currentSeasonData.season.id} className="mb-4">
                    <ul className="space-y-1">
                      {filteredRegulations[0].regulations.map((reg) => {
                        const realIndex = currentSeasonData.regulations.findIndex(r => r.id === reg.id);
                        const isActive = Boolean(selected && selected.seasonId === currentSeasonData.season.id && selected.regulationIndex === realIndex);
                        return (
                          <li key={reg.id}>
                            <button
                              data-sid={currentSeasonData.season.id}
                              data-idx={realIndex}
                              onClick={() => {
                                goTo(currentSeasonData.season.id, realIndex);
                                if (typeof window !== 'undefined' && window.innerWidth < 768) setSidebarOpen(false);
                              }}
                              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary border border-transparent text-sm
                                ${isActive
                                  ? "bg-primary text-primary-foreground font-medium border-primary shadow-sm"
                                  : "hover:bg-muted text-foreground"
                              }`}
                              {...(isActive ? { "aria-current": "true" } : {})}
                            >
                              <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`}>
                                {reg.order}
                              </span>
                              <span className="flex-1 min-w-0 break-words">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }) => <span className="block leading-relaxed break-words">{children}</span>,
                                    strong: ({ children }) => <strong className="font-medium">{children}</strong>,
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                    code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono break-all">{children}</code>,
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
              </div>
            </nav>
          </div>
      {/* Overlay para mobile */}
      {sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (
        <div className="fixed inset-0 z-30 bg-black/60" onClick={() => setSidebarOpen(false)} aria-label="Fechar índice" />
      )}
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="px-4 py-3 border-b border-border bg-background sticky top-0 z-10 md:px-6 md:py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir índice"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                onClick={goPrev}
                disabled={Boolean(!selected || (selected && selected.regulationIndex === 0))}
                className="mr-2 flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col items-center flex-1 w-full px-2 md:px-0">
              {/* Dropdown de seleção de temporada */}
              {availableSeasons.length > 0 && (
                <select
                  className="w-full md:w-auto text-primary font-medium text-sm md:text-base border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                disabled={Boolean(!selected || (selected && currentSeasonData && selected.regulationIndex === currentSeasonData.regulations.length - 1))}
                className="ml-2 flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Próximo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto min-h-0 px-4 py-4 md:px-6 md:py-6 bg-background">
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
              <div className="text-primary font-semibold text-lg mb-3 flex items-center gap-3">
                <span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">{current.order}</span>
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
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-2 first:mt-0">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-sm font-semibold mb-2 mt-2 first:mt-0">{children}</h4>,
                  h5: ({ children }) => <h5 className="text-sm font-medium mb-2 mt-2 first:mt-0">{children}</h5>,
                  h6: ({ children }) => <div className="text-sm font-medium mb-2 mt-2 first:mt-0">{children}</div>,
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
      </div>
    </div>
  );
}; 