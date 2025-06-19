import { Button } from "brk-design-system"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export function Hero() {
  return (
    <section className="relative h-screen md:min-h-[600px] flex items-center justify-center bg-primary overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-6"
        >
          Encontre e participe dos melhores campeonatos de Rental Kart
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-xl text-dark mb-8 max-w-2xl mx-auto"
        >
          Acompanhe sua classificação, inscreva-se em corridas e viva a emoção da velocidade com a comunidade BRK.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
        >
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-semibold w-full sm:w-auto bg-dark hover:bg-dark/90 text-white dark:bg-background shadow-lg transition-all duration-300 border-none"
            asChild
          >
            <Link to="/campeonatos">
              Explorar Campeonatos
            </Link>
          </Button>
          <Button
            size="lg"
            variant={"outline"}
            className="rounded-full px-8 py-6 text-lg font-semibold w-full sm:w-auto bg-transparent border-dark text-dark hover:bg-white hover:text-[#ff6c00] transition-all duration-300"
            asChild
          >
            <Link to="/cadastro">
              Criar Perfil de Piloto
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 