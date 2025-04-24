import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CLUBS, useClub } from "@/contexts/ClubContext"
import { Link } from "react-router-dom"
import { Flag, MapPin, Trophy, Search, X, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Clubs() {
  const { selectClub } = useClub()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredClubs, setFilteredClubs] = useState(CLUBS)
  const [regionFilter, setRegionFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const clubsPerPage = 20
  
  // Extrair regiões únicas para o filtro
  const regions = Array.from(new Set(CLUBS.map(club => club.location.region)))
  
  // Filtrar clubes com base na busca e região selecionada
  useEffect(() => {
    let result = CLUBS
    
    // Aplicar filtro de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(club => 
        club.name.toLowerCase().includes(query) ||
        club.location.city.toLowerCase().includes(query) ||
        club.location.state.toLowerCase().includes(query) ||
        club.location.region.toLowerCase().includes(query)
      )
    }
    
    // Aplicar filtro de região
    if (regionFilter) {
      result = result.filter(club => club.location.region === regionFilter)
    }
    
    setFilteredClubs(result)
    setCurrentPage(1) // Resetar para primeira página quando filtros mudam
  }, [searchQuery, regionFilter])
  
  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchQuery("")
    setRegionFilter(null)
  }
  
  // Calcular clubes para a página atual
  const indexOfLastClub = currentPage * clubsPerPage
  const indexOfFirstClub = indexOfLastClub - clubsPerPage
  const currentClubs = filteredClubs.slice(indexOfFirstClub, indexOfLastClub)
  
  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredClubs.length / clubsPerPage)
  
  // Ir para página anterior
  const goToPreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
  }
  
  // Ir para próxima página
  const goToNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))
  }
  
  return (
    <div className="container px-4 py-10 md:py-16 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary-500" />
          Clubes de Kart
        </h1>
        <p className="text-muted-foreground mb-8">
          Encontre clubes de kart em todo o Brasil e descubra campeonatos, eventos e classificações
        </p>
        
        {/* Filtros */}
        <div className="bg-muted/30 rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome, cidade ou estado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <div className="text-sm font-medium flex items-center whitespace-nowrap">
                Filtrar por região:
              </div>
              {regions.map(region => (
                <Button
                  key={region}
                  variant={regionFilter === region ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRegionFilter(regionFilter === region ? null : region)}
                  className="text-xs"
                >
                  {region}
                </Button>
              ))}
              
              {(searchQuery || regionFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-muted-foreground">
              {filteredClubs.length} {filteredClubs.length === 1 ? 'clube encontrado' : 'clubes encontrados'}
            </div>
            
            {/* Controles de visualização */}
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'cards' ? 'default' : 'outline'} 
                size="sm"
                className="px-2"
                onClick={() => setViewMode('cards')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                className="px-2"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Lista de clubes - Modo Cards */}
        {viewMode === 'cards' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentClubs.map(club => (
              <Card 
                key={club.id}
                className="hover:border-primary-500/50 transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-3">
                    {club.logo ? (
                      <img 
                        src={club.logo} 
                        alt={club.name} 
                        className="w-12 h-12 object-contain rounded-md bg-muted p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-md bg-primary-500/10">
                        <Flag className="h-6 w-6 text-primary-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{club.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {club.location.city}, {club.location.state}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-md p-3 mb-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-medium">{club.championships?.categories?.length || 0}</div>
                        <div className="text-xs text-muted-foreground">Categorias</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{club.history.totalPilots}</div>
                        <div className="text-xs text-muted-foreground">Pilotos</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{club.championships?.total || 0}</div>
                        <div className="text-xs text-muted-foreground">Campeonatos</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {club.championships?.categories?.slice(0, 3).map(category => (
                      <span 
                        key={category} 
                        className="bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded text-xs"
                      >
                        {category}
                      </span>
                    ))}
                    {club.championships?.categories?.length > 3 && (
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs">
                        +{club.championships.categories.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                    onClick={() => selectClub(club)}
                    asChild
                  >
                    <Link to={`/clube/${club.alias}`}>
                      Ver detalhes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Lista de clubes - Modo Lista */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {/* Cabeçalho da tabela */}
            <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto] gap-4 bg-muted/30 p-3 rounded-lg font-medium text-sm">
              <div className="w-12"></div>
              <div>Nome do Clube</div>
              <div>Região</div>
              <div className="text-right pr-4">Categorias</div>
            </div>
            
            {currentClubs.map(club => (
              <div 
                key={club.id}
                className="bg-muted/10 hover:bg-muted/30 transition-colors rounded-lg"
              >
                <Link 
                  to={`/clube/${club.alias}`}
                  onClick={() => selectClub(club)}
                  className="p-3 md:py-4 md:px-3 flex md:grid md:grid-cols-[auto_1fr_auto_auto] gap-3 md:gap-4 items-center"
                >
                  {club.logo ? (
                    <img 
                      src={club.logo} 
                      alt={club.name} 
                      className="w-10 h-10 object-contain rounded-md bg-muted p-1"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary-500/10">
                      <Flag className="h-5 w-5 text-primary-500" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-bold text-sm md:text-base">{club.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {club.location.city}, {club.location.state}
                    </div>
                  </div>
                  
                  <div className="hidden md:block text-sm">
                    {club.location.region}
                  </div>
                  
                  <div className="hidden md:flex gap-1 justify-end">
                    {club.championships?.categories?.slice(0, 2).map(category => (
                      <span 
                        key={category} 
                        className="bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded text-xs"
                      >
                        {category}
                      </span>
                    ))}
                    {club.championships?.categories?.length > 2 && (
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs">
                        +{club.championships.categories.length - 2}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Mensagem para lista vazia */}
        {filteredClubs.length === 0 && (
          <div className="bg-muted/30 p-10 rounded-lg text-center">
            <Flag className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">Nenhum clube encontrado</h3>
            <p className="text-muted-foreground mb-4">Tente ajustar os filtros para encontrar o que procura</p>
            <Button onClick={clearFilters}>
              Limpar todos os filtros
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
} 