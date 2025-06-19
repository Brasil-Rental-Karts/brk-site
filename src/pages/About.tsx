import { PageHeader } from "brk-design-system";
import { motion } from "framer-motion";
import { Trophy, Users, Flag, Rocket, Target, Eye } from "lucide-react";
import { Button, Card } from "brk-design-system";
import { Link } from "react-router-dom";

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
          title="Sobre a BRK – Brasil Rental Karts"
          subtitle="Nascemos da paixão pelas pistas e do desejo de unir praticidade, inovação e comunidade em um só lugar. De Piloto. Para Piloto."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="prose prose-lg dark:prose-invert"
      ></motion.div>

      <section>
        <div className="gap-16 items-center py-8 mx-auto lg:grid lg:grid-cols-2">
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="font-heading mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              De Piloto.
              <br />
              Para Piloto.
            </h2>
            <p className="mb-4">
              A BRK nasceu digital. Acreditamos que a inovação é o combustível
              que move o kartismo rumo ao futuro. Utilizamos tecnologia para
              automatizar processos, melhorar a comunicação entre pilotos e
              organizadores e criar uma jornada fluida desde a inscrição até o
              pódio. Estamos em constante evolução, desenvolvendo recursos
              inteligentes e mantendo uma plataforma estável, intuitiva e
              responsiva.
            </p>
            <h3>Nossos objetivos:</h3>
            <ul className="space-y-2 mb-6">
              <li>Padronizar a organização de campeonatos amadores</li>
              <li>Criar um ranking nacional unificado</li>
              <li>Facilitar a descoberta de eventos e competições</li>
              <li>Promover o desenvolvimento do kartismo no Brasil</li>
            </ul>
            <Button
              asChild
              size="lg"
              variant="default"
              className="px-8 py-6 rounded-full transition-all duration-300"
            >
              <Link to="/cadastro">Quero fazer parte da comunidde BRK</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <img
              className="w-full rounded-lg"
              src="croqui-brk.png"
              alt="Conceito BRK"
            />
            <img
              className="mt-4 w-full lg:mt-10 rounded-lg"
              src="escritorio-brk.jpg"
              alt="Escritório BRK"
            />
          </div>
        </div>
      </section>

      {/* Seção Missão e Visão em colunas */}
      <section className="my-16">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card className="flex flex-col items-center text-center p-8 bg-white dark:bg-dark-800 border border-primary/20 shadow-md">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">
                Missão
              </h3>
              <p className="text-base text-muted-foreground">
                Conectar e impulsionar a comunidade do kartismo brasileiro por
                meio da tecnologia, promovendo experiências mais organizadas,
                acessíveis e emocionantes dentro e fora das pistas.
              </p>
            </Card>
            <Card className="flex flex-col items-center text-center p-8 bg-white dark:bg-dark-800 border border-primary/20 shadow-md">
              <Eye className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">
                Visão
              </h3>
              <p className="text-base text-muted-foreground">
                Ser a maior e mais confiável plataforma digital de kart rental
                do Brasil, reconhecida por revolucionar a forma como pilotos e
                organizadores interagem, competem e evoluem no esporte.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Seção de Estatísticas Institucionais */}
      <section className="my-16 rounded-2xl text-foreground py-12 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Resultados que aceleram o kartismo amador
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              A BRK é referência nacional em tecnologia, organização e apoio ao
              kartismo amador. Veja alguns dos nossos números:
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <Card className="flex flex-col items-center p-8 bg-white dark:bg-dark-800 border border-primary/20 shadow-md">
              <Trophy className="h-10 w-10 mb-3 text-foregound/90 text-primary" />
              <span className="text-3xl font-bold">+3</span>
              <span className="text-base mt-1 text-foregound/80">
                Campeonatos organizados
              </span>
            </Card>
            <Card className="flex flex-col items-center p-8 bg-white dark:bg-dark-800 border border-primary/20 shadow-md">
              <Users className="h-10 w-10 mb-3 text-foregound/90 text-primary" />
              <span className="text-3xl font-bold">+100</span>
              <span className="text-base mt-1 text-foregound/80">
                Pilotos cadastrados
              </span>
            </Card>
            <Card className="flex flex-col items-center p-8 bg-white dark:bg-dark-800 border border-primary/20 shadow-md">
              <Flag className="h-10 w-10 mb-3 text-foregound/90 text-primary" />
              <span className="text-3xl font-bold">+1</span>
              <span className="text-base mt-1 text-foregound/80">
                Estados atendidos
              </span>
            </Card>
            <Card className="flex flex-col items-center p-8 bg-white dark:bg-dark-800 border border-primary/20 shadow-md">
              <Rocket className="h-10 w-10 mb-3 text-foregound/90 text-primary" />
              <span className="text-3xl font-bold">+50</span>
              <span className="text-base mt-1 text-foregound/80">
                Corridas registradas
              </span>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              variant="default"
              className="px-8 py-6 rounded-full transition-all duration-300"
            >
              <Link to="/cadastro">Quero fazer parte da comunidade BRK</Link>
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
