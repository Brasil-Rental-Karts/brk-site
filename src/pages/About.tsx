import { motion } from "framer-motion"

export function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container px-8 py-16"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold mb-8"
        >
          Sobre o BRK
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="prose prose-lg dark:prose-invert"
        >
          <p className="text-xl text-muted-foreground mb-6">
            O Brasil Rental Karts (BRK) é uma plataforma inovadora dedicada a unificar e profissionalizar o kartismo amador no Brasil.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
          <p className="text-muted-foreground mb-6">
            Conectar pilotos, equipes e kartódromos em uma única plataforma, oferecendo ferramentas profissionais para gestão de campeonatos e acompanhamento de desempenho.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Objetivos</h2>
          <ul className="space-y-4 text-muted-foreground mb-6">
            <li>Padronizar a organização de campeonatos amadores</li>
            <li>Criar um ranking nacional unificado</li>
            <li>Facilitar a descoberta de eventos e competições</li>
            <li>Promover o desenvolvimento do kartismo no Brasil</li>
          </ul>
          
          <h2 className="text-2xl font-bold mb-4">Tecnologia e Inovação</h2>
          <p className="text-muted-foreground">
            Utilizamos tecnologia de ponta para oferecer uma experiência única aos usuários, com recursos como telemetria em tempo real, análise de dados e gestão completa de campeonatos.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
} 