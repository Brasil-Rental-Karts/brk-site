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
import { ChevronDown, Menu, X, Trophy, Info, User, LogOut } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
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
    setMobileMenuOpen(false)
    setPilotSearchQuery("")
    navigate(`/pilotos/${pilot.slug}`)
  }

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMobileMenuOpen(!mobileMenuOpen)
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
  
  // Focus pilot search input when dropdown opens
  useEffect(() => {
    if (pilotDropdownOpen && pilotSearchInputRef.current) {
      setTimeout(() => {
        pilotSearchInputRef.current?.focus()
      }, 100)
    }
  }, [pilotDropdownOpen])

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
    <nav className="border-b bg-background relative z-20">
      <div className="container h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src="/logo-brk.svg" alt="BRK Logo" className="h-6 w-auto" />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/campeonato">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary-500 transition-all duration-200 ease-in-out"
              >
                <Trophy className="h-4 w-4" />
                Campeonato
              </Button>
            </Link>
            
            {/* Desktop pilots dropdown */}
            <DropdownMenu open={pilotDropdownOpen} onOpenChange={setPilotDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary-500 transition-all duration-200 ease-in-out"
                >
                  <User className="h-4 w-4" />
                  <span className="flex items-center">
                    Pilotos
                    <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200" 
                      style={{ transform: pilotDropdownOpen ? 'rotate(-180deg)' : 'rotate(0)' }}
                    />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-[350px] p-4">
                <div className="sticky top-0 bg-background pt-1 space-y-3">
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
                
                <div className="max-h-[50vh] overflow-y-auto mt-3 pr-1">
                  {pilotSearchQuery ? (
                    filteredPilots.length === 0 && showPilotEmptyMessage ? (
                      <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                        <Info className="h-8 w-8 text-muted-foreground/50" />
                        <div>
                          <p className="font-medium text-sm">Nenhum piloto encontrado</p>
                          <p className="text-xs text-muted-foreground mt-1">Tente outro termo ou explore os pilotos disponíveis</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={clearPilotSearch}
                        >
                          Ver todos os pilotos
                        </Button>
                      </div>
                    ) : (
                      filteredPilots.map((pilot) => (
                        <Card 
                          key={pilot.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-muted/80 mb-2"
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
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Digite pelo menos 2 caracteres para buscar pilotos
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          
          {/* Auth section */}
          {authLoading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary-500/10 text-primary-500 text-xs">
                      {getInitials(user.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.name && <p className="font-medium">{user.name}</p>}
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild>
              <a href={`${APP_URL}/login`}>Entrar</a>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <Link 
              to="/campeonato" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Trophy className="h-5 w-5 text-primary-500" />
              <span className="font-medium">Campeonato</span>
            </Link>
            
            {/* Mobile pilot search */}
            <div className="space-y-3">
              <div className="text-sm font-medium px-3">Buscar pilotos</div>
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
                <div className="text-xs text-muted-foreground px-3">
                  {filteredPilots.length} {filteredPilots.length === 1 ? 'piloto encontrado' : 'pilotos encontrados'}
                </div>
              )}
              
              <div className="space-y-2">
                {pilotSearchQuery ? (
                  filteredPilots.length === 0 && showPilotEmptyMessage ? (
                    <div className="py-4 text-center">
                      <p className="font-medium text-sm">Nenhum piloto encontrado</p>
                      <p className="text-xs text-muted-foreground mt-1">Tente outro termo</p>
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
          </div>
        </div>
      )}
    </nav>
  )
} 