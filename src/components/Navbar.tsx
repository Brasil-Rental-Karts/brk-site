import { ModeToggle } from "./mode-toggle"
import { Button } from "brk-design-system"
import { Link, useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "brk-design-system"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "brk-design-system"
import { ChevronDown, Menu } from "lucide-react"
import { useState, useRef, useEffect, ChangeEvent } from "react"
import { SearchInput } from "./ui/input"
import { Card, CardContent } from "brk-design-system"
import { getInitials } from "@/utils/pilot-utils"
import { Avatar, AvatarFallback } from "brk-design-system"
import { fetchWithAuth } from "@/utils/fetchWithAuth"

// Use the environment variable or default to the production URL if not set
const APP_URL = import.meta.env.VITE_APP_URL
const API_URL = import.meta.env.VITE_API_URL

export function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  
  // Estados para a pesquisa de pilotos
  const [pilotSearchQuery, setPilotSearchQuery] = useState("")
  const [pilotDropdownOpen, setPilotDropdownOpen] = useState(false)
  const pilotSearchInputRef = useRef<HTMLInputElement>(null)
  const [showPilotEmptyMessage, setShowPilotEmptyMessage] = useState(false)

  // Auth state for brk-site
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [pilots, setPilots] = useState<any[]>([])
  useEffect(() => {
    const cacheApiUrl = import.meta.env.VITE_CACHE_API_URL;
    if (!cacheApiUrl) {
      console.warn('VITE_CACHE_API_URL not configured');
      setPilots([]);
      return;
    }
    
    fetch(`${cacheApiUrl}/cache/pilot`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => setPilots(data.data || []))
      .catch(error => {
        console.error('Failed to fetch pilots:', error);
        setPilots([]);
      })
  }, [])
  
  const handlePilotSelect = (pilot: typeof pilots[0]) => {
    setPilotDropdownOpen(false)
    setIsOpen(false)
    setPilotSearchQuery("")
    navigate(`/pilotos/${pilot.slug}`)
  }
  
  // Handle pilot search input change
  const handlePilotSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPilotSearchQuery(e.target.value)
    // Reset empty message timer on each input change
    setShowPilotEmptyMessage(false)
    if (e.target.value.length >= 2 && filteredPilots.length === 0) {
      // Show empty message after slight delay
      setTimeout(() => setShowPilotEmptyMessage(true), 300)
    }
  }

  // Clear pilot search input
  const clearPilotSearch = () => {
    setPilotSearchQuery("")
    setShowPilotEmptyMessage(false)
  }
  
  // Filter pilots based on search query
  const filteredPilots = pilotSearchQuery.length >= 2 
    ? pilots
        .filter(pilot => 
          pilot.name.toLowerCase().includes(pilotSearchQuery.toLowerCase()) || 
          (pilot.nickname && pilot.nickname.toLowerCase().includes(pilotSearchQuery.toLowerCase())) ||
          pilot.category.toLowerCase().includes(pilotSearchQuery.toLowerCase()) ||
          (`#${pilot.number}`.includes(pilotSearchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : []

  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true)
      try {
        const res = await fetchWithAuth(`${API_URL}/auth/me`)
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch {}
    setUser(null)
    navigate("/")
  }

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img
              src="/logo-brk-marca-horizontal-black.svg"
              alt="BRK Logo"
              className="h-6 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo-brk.svg";
              }}
            />
          </Link>

          {/* Menu para Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground focus:outline-none"
            >
              Início
                          </Link>
            
            <Link
              to="/campeonato"
              className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground focus:outline-none"
            >
              Campeonato
            </Link>
            
            {/* Desktop pilots dropdown */}
            <DropdownMenu open={pilotDropdownOpen} onOpenChange={setPilotDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground focus:outline-none text-primary-foreground"
                >
                  <span className="flex items-center">
                    Pilotos
                    <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200" 
                      style={{ transform: pilotDropdownOpen ? 'rotate(-180deg)' : 'rotate(0)' }}
                    />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-[400px] p-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Buscar pilotos</div>
                  <SearchInput
                    ref={pilotSearchInputRef}
                    placeholder="Digite o nome, número ou categoria..."
                    value={pilotSearchQuery}
                    onChange={handlePilotSearchChange}
                    clearable={!!pilotSearchQuery}
                    onClear={clearPilotSearch}
                    variant="muted"
                    inputSize="default"
                    className="rounded-lg transition-all focus-visible:ring-primary-500/20 focus-visible:border-primary-500/50"
                  />
                  {pilotSearchQuery && (
                    <div className="text-xs text-muted-foreground">
                      {filteredPilots.length} {filteredPilots.length === 1 ? 'piloto encontrado' : 'pilotos encontrados'}
                    </div>
                  )}
                </div>
                
                <div className="max-h-[300px] overflow-y-auto mt-3">
                  {pilotSearchQuery ? (
                    filteredPilots.length === 0 && showPilotEmptyMessage ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Nenhum piloto encontrado
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredPilots.map((pilot) => (
                        <Card 
                          key={pilot.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-muted/80"
                          onClick={() => handlePilotSelect(pilot)}
                        >
                          <CardContent className="p-3 flex items-start space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary-500/10 text-primary-500 text-sm font-medium">
                                  {getInitials(pilot.name)}
                                </AvatarFallback>
                              </Avatar>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{pilot.name}</div>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                  <span className="mr-2">#{pilot.number}</span>
                                  <span>{pilot.category}</span>
                                </div>
                            </div>
                          </CardContent>
                        </Card>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Digite pelo menos 2 caracteres para buscar pilotos
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        {/* Menu para Mobile */}
        <div className="flex items-center gap-4">
          {authLoading ? (
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 animate-pulse" />
          ) : user ? (
              <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none hidden md:flex">
                  <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarFallback className="text-foreground">
                      {user?.name ? user.name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase().slice(0,2) : (user?.email ? user.email[0].toUpperCase() : 'U')}
                        </AvatarFallback>
                    </Avatar>
                  <span className="text-sm font-medium">{user?.name}</span>
                  <ChevronDown
                    className="h-4 w-4 transition duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                  <a href={`${APP_URL}/dashboard`} target="_blank" rel="noopener noreferrer">
                    Dashboard
                  </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                  <a href={`${APP_URL}/perfil`} target="_blank" rel="noopener noreferrer">
                    Perfil
                  </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                  <a href={`${APP_URL}/plano`} target="_blank" rel="noopener noreferrer">
                    Plano
                  </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                  <a href={`${APP_URL}/ajuda`} target="_blank" rel="noopener noreferrer">
                    Ajuda
                  </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
              size="sm" 
              variant="ghost"
              className="hidden md:flex text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
              <a href={`${APP_URL}/login`}>Entrar</a>
              </Button>
            )}

          {/* Theme Toggle */}
          <ModeToggle />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
                className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
          </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {user && (
                  <div className="flex items-center gap-2 p-2">
                  <Avatar>
                      <AvatarFallback className="text-foreground">
                        {user?.name ? user.name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase().slice(0,2) : (user?.email ? user.email[0].toUpperCase() : 'U')}
                      </AvatarFallback>
                  </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                )}
                <nav className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="px-2 py-1 rounded-md hover:bg-accent/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Início
                  </Link>
                  <Link
                    to="/campeonato"
                    className="px-2 py-1 rounded-md hover:bg-accent/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Campeonato
                    </Link>
                  
                  {/* Mobile pilot search */}
                  <div className="space-y-3 mt-4">
                    <div className="text-sm font-medium px-2">Buscar pilotos</div>
            <SearchInput
              placeholder="Digite o nome, número ou categoria..."
              value={pilotSearchQuery}
              onChange={handlePilotSearchChange}
              clearable={!!pilotSearchQuery}
              onClear={clearPilotSearch}
              variant="muted"
              inputSize="default"
                      className="rounded-lg"
                    />
                    
                    {pilotSearchQuery && (
                      <div className="text-xs text-muted-foreground px-2">
                        {filteredPilots.length} {filteredPilots.length === 1 ? 'piloto encontrado' : 'pilotos encontrados'}
                      </div>
                    )}
                    
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {pilotSearchQuery ? (
                filteredPilots.length === 0 && showPilotEmptyMessage ? (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            Nenhum piloto encontrado
                    </div>
                        ) : (
                  filteredPilots.map((pilot) => (
                    <Card 
                      key={pilot.id}
                              className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                      onClick={() => handlePilotSelect(pilot)}
                    >
                      <CardContent className="p-3 flex items-start space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary-500/10 text-primary-500 text-sm font-medium">
                                    {getInitials(pilot.name)}
                                  </AvatarFallback>
                                </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{pilot.name}</div>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <span className="mr-2">#{pilot.number}</span>
                                    <span>{pilot.category}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                        )
                      ) : (
                        <div className="py-4 text-center text-sm text-muted-foreground">
                          Digite pelo menos 2 caracteres para buscar pilotos
                </div>
              )}
            </div>
          </div>
          
                  {user && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <a
                        href={`${APP_URL}/dashboard`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </a>
                      <a
                        href={`${APP_URL}/perfil`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Perfil
                      </a>
                      <a
                        href={`${APP_URL}/plano`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Plano
                      </a>
                      <a
                        href={`${APP_URL}/ajuda`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded-md hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Ajuda
                      </a>
                      <div className="h-px bg-border my-2" />
                      <button
                        className="px-2 py-1 rounded-md hover:bg-accent/50 transition-colors text-destructive text-left"
                        onClick={() => { setIsOpen(false); handleLogout(); }}
                        type="button"
                      >
                        Sair
                      </button>
                    </>
                  )}
                  
                  {!user && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <a
                        href={`${APP_URL}/login`}
                        className="px-2 py-1 rounded-md hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Entrar
                      </a>
                    </>
                  )}
                </nav>
                  </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 