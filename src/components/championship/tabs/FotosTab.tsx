import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Button } from "brk-design-system";
import { Camera, Download, Eye, Calendar, Grid, List } from "lucide-react";

interface FotosTabProps {
  championship: {
    name: string;
    currentSeason: {
      name: string;
    };
  };
}

export const FotosTab = ({ championship }: FotosTabProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  // Dados mockados de fotos
  const fotoCategories = [
    { value: 'todas', label: 'Todas as Fotos' },
    { value: 'corridas', label: 'Corridas' },
    { value: 'podio', label: 'Pódio' },
    { value: 'bastidores', label: 'Bastidores' },
    { value: 'treinos', label: 'Treinos' }
  ];

  const fotoAlbuns = [
    {
      id: 1,
      title: "Etapa JFK - Junho 2025",
      date: "14/06/2025",
      categoria: "corridas",
      fotos: 45,
      capa: "/foto-etapa-jfk.jpg",
      description: "Fotos da emocionante etapa JFK com grandes disputas"
    },
    {
      id: 2,
      title: "Pódio - Temporada 1",
      date: "14/06/2025",
      categoria: "podio", 
      fotos: 28,
      capa: "/foto-podio.jpg",
      description: "Momentos especiais do pódio com os vencedores"
    },
    {
      id: 3,
      title: "Bastidores - Preparação",
      date: "14/06/2025",
      categoria: "bastidores",
      fotos: 32,
      capa: "/foto-bastidores.jpg",
      description: "Nos bastidores: preparação e momentos únicos"
    },
    {
      id: 4,
      title: "Treinos Livres",
      date: "13/06/2025",
      categoria: "treinos",
      fotos: 18,
      capa: "/foto-treinos.jpg",
      description: "Aquecimento e preparação para a corrida"
    },
    {
      id: 5,
      title: "Etapa Anterior - Maio",
      date: "15/05/2025",
      categoria: "corridas",
      fotos: 52,
      capa: "/foto-etapa-maio.jpg",
      description: "Recordações da etapa de maio"
    },
    {
      id: 6,
      title: "Cerimônia de Abertura",
      date: "15/03/2025",
      categoria: "bastidores",
      fotos: 24,
      capa: "/foto-abertura.jpg",
      description: "Abertura oficial da temporada 2025"
    }
  ];

  const filteredAlbuns = selectedCategory === 'todas' 
    ? fotoAlbuns 
    : fotoAlbuns.filter(album => album.categoria === selectedCategory);

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Camera className="h-8 w-8 text-primary" />
          Galeria de Fotos
        </h1>
        <p className="text-muted-foreground mb-6">
          Reviva os melhores momentos do {championship.currentSeason.name}
        </p>
      </motion.div>

      {/* Filtros e Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2">
          {fotoCategories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="text-xs"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Controles de visualização */}
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            className="px-2"
            onClick={() => setViewMode('grid')}
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
      </motion.div>

      {/* Contador de resultados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-muted-foreground mb-4"
      >
        {filteredAlbuns.length} {filteredAlbuns.length === 1 ? 'álbum encontrado' : 'álbuns encontrados'}
      </motion.div>

      {/* Grid de Álbuns - Modo Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbuns.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={album.capa}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3EFoto%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      {album.fotos} fotos
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">{album.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{album.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {album.date}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {fotoCategories.find(cat => cat.value === album.categoria)?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lista de Álbuns - Modo Lista */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredAlbuns.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={album.capa}
                          alt={album.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='10' font-family='Arial'%3EFoto%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold mb-1">{album.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{album.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {album.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              {album.fotos} fotos
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {fotoCategories.find(cat => cat.value === album.categoria)?.label}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Informações sobre uso das fotos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 p-4 bg-muted/30 rounded-lg"
      >
        <h3 className="font-semibold mb-2">Sobre as Fotos:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Todas as fotos são de alta qualidade e disponíveis para download</li>
          <li>• Respeite os direitos autorais e uso pessoal</li>
          <li>• Para uso comercial, entre em contato com a organização</li>
          <li>• Novas fotos são adicionadas após cada evento</li>
        </ul>
      </motion.div>
    </div>
  );
}; 