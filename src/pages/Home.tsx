import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { motion } from "framer-motion"
import { Trophy, Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "brk-design-system"

export function Home() {
  return (
    <div className="space-y-16">
      <Hero />
      <Features />
      
      {/* Seção do Campeonato Principal */}
      <section className="container py-12">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-3"
          >
            Escola da Velocidade
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Onde a paixão por kart ganha forma! Participe do principal campeonato de kart amador do Brasil
          </motion.p>
        </div>
        
        {/* Destaque do Campeonato */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Lado esquerdo - Informações */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Campeonato Oficial 2025
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold">
                Temporada 1 - 2025
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                Uma copa de kart que vem acelerando corações há 3 anos no lendário 
                Kartódromo Beto Carrero, reunindo pilotos de todas as idades e níveis 
                de experiência em disputas eletrizantes.
              </p>
              
              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2021</div>
                  <div className="text-xs text-muted-foreground">Fundação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100</div>
                  <div className="text-xs text-muted-foreground">Pilotos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">6</div>
                  <div className="text-xs text-muted-foreground">Temporadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4</div>
                  <div className="text-xs text-muted-foreground">Categorias</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="flex-1 sm:flex-none">
                  <Link to="/campeonato">
                    Ver Campeonato
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none">
                  <Link to="/campeonato?tab=calendario">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Calendário
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Lado direito - Imagem/Visual */}
            <div className="relative">
              <div className="aspect-square bg-muted/30 rounded-xl overflow-hidden">
                <img 
                  src="/escola-velocidade-hero.jpg"
                  alt="Escola da Velocidade"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23374151'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='24' font-family='Arial'%3EEscola da%3C/text%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='24' font-family='Arial'%3EVelocidade%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              
              {/* Badge flutuante */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Inscrições Abertas!
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Próximas Etapas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Próximas Etapas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { date: "14", month: "JUN", day: "Sábado", stage: "Etapa JFK", status: "Inscrição Aberta" },
              { date: "14", month: "JUL", day: "Sábado", stage: "Etapa JFK", status: "Programado" },
              { date: "14", month: "AGO", day: "Sábado", stage: "Etapa JFK", status: "Programado" }
            ].map((event, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-xl font-bold">{event.date}</div>
                  <div className="text-sm text-muted-foreground uppercase">{event.month}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{event.day}</div>
                  <div className="font-bold">{event.stage}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    event.status === "Inscrição Aberta" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {event.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link 
            to="/about"
            className="text-primary-500 hover:underline text-sm flex items-center justify-center"
          >
            Saiba mais sobre nosso projeto
          </Link>
        </motion.div>
      </section>
    </div>
  )
} 