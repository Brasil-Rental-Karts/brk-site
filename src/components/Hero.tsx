import { Button } from "brk-design-system"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const APP_URL = import.meta.env.VITE_APP_URL

export function Hero() {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-500 opacity-90" />
      <div className="relative container pt-32 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-background mb-6"
        >
          Brasil Rental Karts
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-background/90 mb-8 max-w-2xl mx-auto"
        >
          Conectando clubes amadores e profissionalizando a gestão de ligas e pilotos em todo o Brasil.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            size="lg" 
            className="rounded-full px-8 py-6 text-lg bg-background text-primary-500 hover:bg-background/90 transition-all duration-300 w-full sm:w-auto"
          >
            <a href={APP_URL} target="_blank">
              Junte-se à BRK
            </a>
          </Button>
          <Button 
            size="lg"
            className="rounded-full px-8 py-6 text-lg bg-transparent border-2 border-background text-background hover:bg-background hover:text-primary-500 transition-all duration-300 w-full sm:w-auto"
            asChild
          >
            <Link to="/about">
              Saiba Mais
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 