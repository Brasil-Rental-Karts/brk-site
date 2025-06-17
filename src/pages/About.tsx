import { PageHeader } from "brk-design-system";
import { motion } from "framer-motion";

export function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <PageHeader
          title="Sobre a BRK"
          subtitle="O Brasil Rental Karts (BRK) é uma plataforma inovadora dedicada a unificar e profissionalizar o kartismo amador no Brasil."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="prose prose-lg dark:prose-invert"
      >
        <h2 className="font-heading text-2xl font-bold mb-4">Nossa Missão</h2>
        <p className="mb-6">
          Conectar pilotos, equipes e kartódromos em uma única plataforma,
          oferecendo ferramentas profissionais para gestão de campeonatos e
          acompanhamento de desempenho.
        </p>

        <h2 className="font-heading text-2xl font-bold mb-4">Objetivos</h2>
        <ul className="space-y-2 mb-6">
          <li>Padronizar a organização de campeonatos amadores</li>
          <li>Criar um ranking nacional unificado</li>
          <li>Facilitar a descoberta de eventos e competições</li>
          <li>Promover o desenvolvimento do kartismo no Brasil</li>
        </ul>

        <h2 className="font-heading text-2xl font-bold mb-4">
          Tecnologia e Inovação
        </h2>
        <p>
          Utilizamos tecnologia de ponta para oferecer uma experiência única aos
          usuários, com recursos como telemetria em tempo real, análise de dados
          e gestão completa de campeonatos.
        </p>
      </motion.div>
    </motion.div>
  );
}
