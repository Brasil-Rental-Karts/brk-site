import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { useClub, CLUBS } from "@/contexts/ClubContext"
import { motion } from "framer-motion"
import { Trophy, MapPin, Calendar, Users } from "lucide-react"
import { Link } from "react-router-dom"

export function Home() {
  const { selectClub } = useClub()

  return (
    <div className="space-y-16">
      <Hero />
      <Features />
      
      <section className="container px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-3"
            >
              Clubes em Destaque
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Conheça os principais clubes de kart amador do Brasil e participe dos eventos
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CLUBS.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                className="bg-muted/30 rounded-lg overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => selectClub(club)}
              >
                <div className="h-40 bg-muted/50 flex items-center justify-center">
                  <img 
                    src={club.logo} 
                    alt={club.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-2">{club.name}</h3>
                  <div className="text-sm text-muted-foreground flex items-center mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {club.location.city}, {club.location.state}
                  </div>
                  <div className="border-t border-border/40 pt-3 mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <Trophy className="h-3 w-3 mr-1 text-primary-500" />
                      <span>{club.championships.total} campeonatos</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-primary-500" />
                      <span>Desde {club.history.founded}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <Users className="h-3 w-3 mr-1 text-primary-500" />
                      <span>{club.history.totalPilots} pilotos participantes</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-10"
          >
            <Link 
              to="/about"
              className="text-primary-500 hover:underline text-sm flex items-center justify-center"
            >
              Saiba mais sobre nosso projeto
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 