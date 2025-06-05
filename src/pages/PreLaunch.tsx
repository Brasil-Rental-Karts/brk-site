import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Calendar, Timer } from "lucide-react";

export function PreLaunch() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de captura de leads
    console.log({ name, email });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-lvh overflow-hidden bg-primary text-primary-foreground content-center">
        <div className="absolute inset-0" />
        <div className="relative container max-w-5xl mx-auto text-center px-4">
          <div className="flex justify-center mb-12">
            <img
              src="/logo-brk-marca-horizontal-black.svg"
              alt="BRK Logo"
              className="h-8 w-auto"
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-6">
              A plataforma feita pra quem vive o kart além da pista
            </h1>
            <p className="text-xl mb-12 max-w-2xl mx-auto">
           Acompanhe campeonatos, inscreva-se em corridas, acesse telemetria, rankings e muito mais. Tudo em um só lugar, para acelerar sua paixão pelas pistas.
            </p>
          </div>

          {/* Form de Captura */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 text-primary-foreground placeholder:text-primary-foreground/70 border-white/20 rounded-lg"
                required
              />
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 text-primary-foreground placeholder:text-primary-foreground/70 border-white/20 rounded-lg"
                required
              />
              <Button
                type="submit"
                className="w-full bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90 rounded-2xl"
                size="lg"
              >
                Entrar para a Lista VIP
              </Button>
            </form>
            <p className="text-xs text-white/70 mt-3">
              Não enviamos spam. Seus dados estão seguros conosco.
            </p>
          </motion.div>
        </div>
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          initial={{ y: 0, opacity: 0.5 }}
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* Sobre o BRK */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl text-center"
          >
            De Piloto.<br />Para Piloto.
          </motion.h2>

          <div className="relative flex justify-center items-center">
            {/* Center mockup image */}
            <div className="hidden lg:block w-full md:w-[750px]">
              <motion.img 
                src="/public/brk-mockup.png" 
                alt="Hero Image" 
                className="w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Left side cards */}
            <div className="absolute left-0 space-y-60 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6 w-full md:w-[250px] text-center shadow-lg hover:shadow-xl transition-shadow"
                      style={{ transform: 'rotate(-5deg)' }}>
                  <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Gestão Profissional
                  </h3>
                  <p className="text-muted-foreground">
                    Sistema completo para gerenciar campeonatos, pontuações e
                    rankings.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-6 w-full md:w-[250px] text-center shadow-lg hover:shadow-xl transition-shadow"
                      style={{ transform: 'rotate(3deg)' }}>
                  <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Comunidade Unida</h3>
                  <p className="text-muted-foreground">
                    Conecte-se com pilotos e organizadores de todo o Brasil.
                  </p>
                </Card>
              </motion.div>
            </div>

            {/* Right side card */}
            <motion.div
              className="absolute right-0"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 w-full md:w-[250px] text-center shadow-lg hover:shadow-xl transition-shadow"
                    style={{ transform: 'rotate(5deg)' }}>
                <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Calendário Integrado
                </h3>
                <p className="text-muted-foreground">
                  Acompanhe eventos e não perca nenhuma corrida importante.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="pb-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <h2
            className="font-heading text-3xl text-center mb-12"
          >
            O Que Dizem os Pilotos
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <p className="text-lg mb-4">
                "A plataforma revolucionou a forma como organizamos nossos
                campeonatos. Tudo ficou mais profissional e organizado."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100" />
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
                <div className="w-12 h-12 rounded-full bg-primary-100" />
                <div>
                  <p className="font-semibold">Eduardo</p>
                  <p className="text-sm text-muted-foreground">Piloto Amador</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contagem Regressiva e CTA Final */}
      <section className="pb-20 pt-14 bg-primary text-primary-foreground">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Timer className="w-16 h-16 mx-auto mb-4" />
            <h2 className="font-heading text-3xl mb-2">
              O Lançamento Está Próximo
            </h2>
          </motion.div>

          {/* Form de Captura */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 text-primary-foreground placeholder:text-primary-foreground/70 border-white/20 rounded-lg"
                required
              />
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 text-primary-foreground placeholder:text-primary-foreground/70 border-white/20 rounded-lg"
                required
              />
              <Button
                type="submit"
                className="w-full bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90 rounded-2xl"
                size="lg"
              >
                Entrar para a Lista VIP
              </Button>
            </form>
            <p className="text-xs text-white/70 mt-3">
              Não enviamos spam. Seus dados estão seguros conosco.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo-brk.svg" alt="BRK Logo" className="h-6" />
              <span className="text-sm text-muted-foreground">
                Brasil Rental Karts
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">
                Política de Privacidade
              </a>
              <a
                href="https://www.instagram.com/brasilrentalkarts/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
