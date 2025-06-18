import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import { Trophy, Calendar, Users, MapPin, ArrowRight, Zap, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "brk-design-system"
import { Card, CardContent } from "brk-design-system"
import { Badge } from "brk-design-system"
import { championshipService, Championship, Stage } from "@/services/championship.service";

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
  const [featuredChampionships, setFeaturedChampionships] = useState<HomeChampionship[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Buscar todos os campeonatos
        const allChampionships = await championshipService.getAllChampionships();

        // 2. Priorizar campeonatos com 'featured: true'
        const featured = allChampionships.filter(c => (c as HomeChampionship).featured === 'true');
        const notFeatured = allChampionships.filter(c => (c as HomeChampionship).featured !== 'true');
        
        // 3. Selecionar os 3 principais campeonatos
        const topChampionships = [...featured, ...notFeatured].slice(0, 3);
        setFeaturedChampionships(topChampionships as HomeChampionship[]);

        // 4. Buscar eventos dos principais campeonatos
        let allStages: (Stage & { championshipName: string })[] = [];
        for (const champ of topChampionships) {
          const activeSeasons = await championshipService.getActiveSeasonsForChampionship(champ.id);
          if (activeSeasons.length > 0) {
            const seasonId = activeSeasons[0].id; // Pegando a primeira temporada ativa
            try {
              const stages = await championshipService.getStagesForSeason(seasonId);
              const stagesWithChampName = stages.map(stage => ({
                ...stage,
                championshipName: champ.name, 
              }));
              allStages = [...allStages, ...stagesWithChampName];
            } catch (seasonError) {
              console.error(`Failed to fetch stages for season ${seasonId}:`, seasonError);
            }
          }
        }

        // 5. Ordenar e pegar os próximos 3 eventos
        const upcoming = allStages
          .filter(stage => new Date(stage.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3)
          .map(stage => championshipService.formatStageForUI(stage));

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
      <section className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative container py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Lado esquerdo - Conteúdo principal */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Badge className="bg-white/20 text-white border-white/30 mb-4">
                    🏁 Plataforma Oficial de Campeonatos
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold leading-tight"
                >
                  Brasil Rental
                  <span className="block text-primary-200">Karts</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-white/90 leading-relaxed"
                >
                  A plataforma que conecta pilotos, organiza campeonatos e 
                  profissionaliza o kartismo brasileiro.
                </motion.p>
              </div>

              {/* Estatísticas rápidas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-3 gap-6"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold">6</div>
                  <div className="text-sm text-white/70">Campeonatos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-white/70">Pilotos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">25+</div>
                  <div className="text-sm text-white/70">Etapas</div>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                  asChild
                >
                  <Link to="/campeonatos">
                    Ver Campeonatos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white bg-transparent hover:bg-white/10 hover:border-white/70 hover:text-white"
                  asChild
                >
                  <Link to="/about">
                    Saiba Mais
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Lado direito - Visual/Imagem */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="aspect-square bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <img 
                    src="/hero-kart-image.jpg"
                    alt="Kartismo Brasileiro"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3EBrasil Rental%3C/text%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3EKarts%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                
                {/* Elementos flutuantes */}
                <div className="absolute -top-4 -right-4 bg-white text-primary px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🏆 #1 Plataforma
                </div>
                <div className="absolute -bottom-4 -left-4 bg-primary-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  ⚡ Inscrições Abertas
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Campeonatos em Destaque
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubra os principais campeonatos de kart do Brasil e encontre a competição perfeita para você
            </p>
          </motion.div>

          {loading && <p>Carregando...</p>}
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
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-64 lg:h-80">
                      <img
                        src={featuredChampionships[0].championshipImage}
                        alt={featuredChampionships[0].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='24' font-family='Arial'%3E${featuredChampionships[0].name}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge variant={featuredChampionships[0].status === 'Inscrições Abertas' ? 'default' : 'secondary'}>
                          {featuredChampionships[0].status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                          {featuredChampionships[0].name}
                        </h3>
                        <p className="text-white/90 mb-4">
                          {featuredChampionships[0].shortDescription}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {featuredChampionships[0].location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {featuredChampionships[0].pilots} pilotos
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <div className="flex-grow" />
                      <Button asChild className="w-full">
                        <Link to={`/campeonato/${featuredChampionships[0].slug}`}>
                          Ver Campeonato
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
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
                      transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative h-32">
                          <img
                            src={championship.championshipImage}
                            alt={championship.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Crect width='300' height='150' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='14' font-family='Arial'%3E${championship.name}%3C/text%3E%3C/svg%3E`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs">
                              {championship.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-bold mb-1">{championship.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {championship.shortDescription}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {championship.pilots}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {championship.location}
                            </span>
                          </div>
                          <Button asChild size="sm" variant="outline" className="w-full">
                            <Link to={`/campeonato/${championship.slug}`}>
                              Ver Detalhes
                            </Link>
                          </Button>
                        </CardContent>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                Próximos Eventos
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Não perca as próximas etapas dos campeonatos. Inscreva-se e participe!
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
                          <div className="text-3xl font-bold text-primary">{event.date}</div>
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
                          <div className="font-medium text-primary">{event.championship}</div>
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

                      {/* Ação */}
                      <div className="mt-4">
                        <Button 
                          size="sm" 
                          className="w-full"
                          variant={event.status === "Inscrição Aberta" ? "default" : "outline"}
                          disabled={event.status !== "Inscrição Aberta"}
                        >
                          {event.status === "Inscrição Aberta" ? "Inscrever-se" : "Ver Detalhes"}
                        </Button>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
                title: "Campeonatos Profissionais",
                description: "Organização e gestão profissional de campeonatos com sistema de pontuação unificado"
              },
              {
                icon: Zap,
                title: "Inscrições Simplificadas", 
                description: "Processo de inscrição rápido e seguro, com pagamento integrado e confirmação automática"
              },
              {
                icon: Target,
                title: "Rankings Atualizados",
                description: "Acompanhe sua evolução com rankings em tempo real e estatísticas detalhadas"
              }
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
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para acelerar sua carreira no kart?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Junte-se a centenas de pilotos que já fazem parte da maior plataforma de kartismo do Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                asChild
              >
                <Link to="/campeonatos">
                  Explorar Campeonatos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/50 text-white bg-transparent hover:bg-white/10 hover:border-white/70 hover:text-white"
                asChild
              >
                <Link to="/about">
                  Saiba Mais
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 