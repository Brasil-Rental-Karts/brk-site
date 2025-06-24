import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  MapPin,
  ArrowRight,
  Zap,
  Target,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "brk-design-system";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import {
  championshipService,
  Championship,
  Stage,
} from "@/services/championship.service";
import { parseLocalDate } from "@/utils/championship.utils";
import { Hero } from "@/components/Hero";
import { RegisterCTA } from "@/components/RegisterCTA";

interface HomeChampionship extends Championship {
  featured?: string;
  location?: string;
  pilots?: number;
  status?: string;
}

interface UpcomingEventUI {
  date: string;
  month: string;
  stage: string;
  championship: string;
  location: string;
  status: string;
}

export function Home() {
  const [featuredChampionships, setFeaturedChampionships] = useState<
    HomeChampionship[]
  >([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Buscar todos os campeonatos
        const allChampionships =
          await championshipService.getAllChampionships();

        // 2. Priorizar campeonatos com 'featured: true'
        const featured = allChampionships.filter(
          (c) => (c as HomeChampionship).featured === "true"
        );
        const notFeatured = allChampionships.filter(
          (c) => (c as HomeChampionship).featured !== "true"
        );

        // 3. Selecionar os 3 principais campeonatos
        const topChampionships = [...featured, ...notFeatured].slice(0, 3);
        setFeaturedChampionships(topChampionships as HomeChampionship[]);

        // 4. Buscar eventos dos principais campeonatos
        let allStages: (Stage & { championshipName: string })[] = [];
        
        for (const champ of topChampionships) {
          // Buscar TODAS as temporadas do campeonato (não apenas as ativas)
          const allSeasons = await championshipService.getAllSeasons();
          const championshipSeasons = allSeasons.filter(season => season.championshipId === champ.id);
          
          if (championshipSeasons.length > 0) {
            // Ordenar temporadas por data de início (mais recente primeiro)
            const sortedSeasons = championshipSeasons.sort((a, b) => 
              parseLocalDate(b.startDate).getTime() - parseLocalDate(a.startDate).getTime()
            );
            
            const seasonId = sortedSeasons[0].id; // Pegando a temporada mais recente
            
            try {
              const stages = await championshipService.getStagesForSeason(
                seasonId
              );
              
              const stagesWithChampName = stages.map((stage) => ({
                ...stage,
                championshipName: champ.name,
              }));
              allStages = [...allStages, ...stagesWithChampName];
            } catch (seasonError) {
              console.error(
                `Failed to fetch stages for season ${seasonId}:`,
                seasonError
              );
            }
          }
        }

        // 5. Ordenar e pegar os próximos 3 eventos
        const upcoming = allStages
          .filter((stage) => {
            const stageDate = parseLocalDate(stage.date);
            const now = new Date();
            return stageDate >= now;
          })
          .sort(
            (a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()
          )
          .slice(0, 3)
          .map((stage) => {
            const formattedStage = championshipService.formatStageForUI(stage);
            return {
              ...formattedStage,
              championship: stage.championshipName
            };
          });

        setUpcomingEvents(upcoming);
      } catch (err) {
        setError("Falha ao carregar dados da página inicial.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Seção de Campeonatos em Destaque */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-3xl font-bold mb-4">
              Campeonatos em Destaque
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubra os principais campeonatos de kart do Brasil e encontre a
              competição perfeita para você
            </p>
          </motion.div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando campeonatos...</p>
              </div>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && featuredChampionships.length > 0 && (
            <>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Campeonato Principal - Card Grande */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="lg:col-span-2"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
                    {/* Camada de background com imagem borrada e overlay */}
                    <div className="absolute inset-0 z-0">
                      {featuredChampionships[0].championshipImage && (
                        <div className="relative w-full h-full">
                          {/* Imagem de fundo com blur */}
                          <img
                            src={featuredChampionships[0].championshipImage}
                            alt=""
                            className="w-full h-full object-cover blur-md scale-125"
                            onError={(e) => {
                              // Fallback para cor sólida se a imagem não carregar
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                          {/* Overlay escuro para legibilidade */}
                          <div className="absolute inset-0 bg-black/60"></div>
                        </div>
                      )}
                      {/* Fallback de background quando não há imagem */}
                      {!featuredChampionships[0].championshipImage && (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10"></div>
                      )}
                    </div>

                    {/* Conteúdo do card - posicionado acima do background */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Imagem do campeonato */}
                      <div className="h-64 lg:h-80 bg-transparent flex-shrink-0 flex items-center justify-center p-4 relative">
                        {featuredChampionships[0].championshipImage ? (
                          <img
                            src={featuredChampionships[0].championshipImage}
                            alt={featuredChampionships[0].name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='24' font-family='Arial'%3E${featuredChampionships[0].name}%3C/text%3E%3C/svg%3E`;
                            }}
                          />
                        ) : (
                          // Placeholder quando não há imagem
                          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                            <Trophy className="h-16 w-16 text-primary/50" />
                          </div>
                        )}
                        
                        {/* Informações do campeonato sobre a imagem */}
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                            {featuredChampionships[0].name}
                          </h3>
                          <p className="text-white/90 mb-4">
                            {featuredChampionships[0].shortDescription}
                          </p>
                        </div>
                      </div>

                      <CardContent className="p-6 flex-grow flex flex-col bg-white">
                        <div className="h-full">
                          <p>{featuredChampionships[0].fullDescription}</p>
                        </div>
                        <Button asChild className="w-full">
                          <Link
                            to={`/campeonato/${featuredChampionships[0].slug}`}
                          >
                            Ver Campeonato
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>

                {/* Campeonatos Secundários */}
                <div className="space-y-6">
                  {featuredChampionships.slice(1).map((championship, index) => (
                    <motion.div
                      key={championship.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 relative">
                        {/* Camada de background com imagem borrada e overlay */}
                        <div className="absolute inset-0 z-0">
                          {championship.championshipImage && (
                            <div className="relative w-full h-full">
                              {/* Imagem de fundo com blur */}
                              <img
                                src={championship.championshipImage}
                                alt=""
                                className="w-full h-full object-cover blur-md scale-125"
                                onError={(e) => {
                                  // Fallback para cor sólida se a imagem não carregar
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                              {/* Overlay escuro para legibilidade */}
                              <div className="absolute inset-0 bg-black/80"></div>
                            </div>
                          )}
                          {/* Fallback de background quando não há imagem */}
                          {!championship.championshipImage && (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10"></div>
                          )}
                        </div>

                        {/* Conteúdo do card - posicionado acima do background */}
                        <div className="relative z-10 flex flex-col h-full">
                          {/* Imagem do campeonato */}
                          <div className="h-32 bg-transparent flex-shrink-0 flex items-center justify-center p-2 relative">
                            {championship.championshipImage ? (
                              <img
                                src={championship.championshipImage}
                                alt={championship.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Crect width='300' height='150' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='14' font-family='Arial'%3E${championship.name}%3C/text%3E%3C/svg%3E`;
                                }}
                              />
                            ) : (
                              // Placeholder quando não há imagem
                              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                                <Trophy className="h-8 w-8 text-primary/50" />
                              </div>
                            )}
                          </div>

                          <CardContent className="p-4 bg-white">
                            <h4 className="font-bold mb-1">
                              {championship.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {championship.shortDescription}
                            </p>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              <Link to={`/campeonato/${championship.slug}`}>
                                Ver Campeonato
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Link para ver todos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-12"
              >
                <Button asChild variant="outline" size="lg">
                  <Link to="/campeonatos">
                    Ver Todos os Campeonatos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Seção de Próximos Eventos */}
      {!loading && !error && upcomingEvents.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                Próximas Corridas
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Não perca as próximas etapas dos campeonatos. Inscreva-se e
                participe!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      {/* Data */}
                      <div className="text-center mb-4">
                        <div className="bg-primary/10 rounded-lg p-4 inline-block">
                          <div className="text-3xl font-bold text-primary">
                            {event.date}
                          </div>
                          <div className="text-sm text-muted-foreground uppercase font-medium">
                            {event.month}
                          </div>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="space-y-3 text-center">
                        <div>
                          <div className="font-bold text-lg">{event.stage}</div>
                        </div>

                        <div className="space-y-1">
                          <div className="font-medium text-primary">
                            {event.championship}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>

                        <Badge
                          className={`${
                            event.status === "Inscrição Aberta"
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seção de Recursos/Benefícios */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-3xl font-bold mb-4">
              Por que escolher a BRK?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A plataforma mais completa para o kartismo brasileiro
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: "Campeonatos Amadores",
                description:
                  "Organização profissional de campeonatos amadores com sistema de pontuação unificado",
              },
              {
                icon: Zap,
                title: "Inscrições Simplificadas",
                description:
                  "Processo de inscrição rápido e seguro, com pagamento integrado e confirmação automática",
              },
              {
                icon: Target,
                title: "Rankings Atualizados",
                description:
                  "Acompanhe sua evolução com rankings em tempo real e estatísticas detalhadas",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 h-full">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-6" />
                  <h3 className="font-heading text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl text-center mb-12">
            O Que Dizem os Pilotos
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <p className="text-lg mb-4">
                "A plataforma revolucionou a forma como organizamos nossos
                campeonatos. Tudo ficou mais profissional e organizado."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="/ronan-avatar.png"
                  alt="Ronan Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">Ronan</p>
                  <p className="text-sm text-muted-foreground">
                    Organizador de Campeonato
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-lg mb-4">
                "Agora posso acompanhar minha evolução e comparar meu desempenho
                com outros pilotos. Isso me motiva a melhorar cada vez mais."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="/eduardo-avatar.png"
                  alt="Eduardo Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">Eduardo</p>
                  <p className="text-sm text-muted-foreground">Piloto Amador</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <RegisterCTA />
    </div>
  );
}
