import { Button } from "brk-design-system";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function RegisterCTA() {
  return (
    <section className="py-20 bg-primary text-dark">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl md:text-3xl font-bold mb-6">
            Pronto para acelerar sua carreira no kart?
          </h2>
          <p className="text-xl mb-8">
            Junte-se a pilotos que já fazem parte da plataforma de kartismo do Brasil
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-white dark:bg-background shadow-lg transition-all duration-300 border-none"
              asChild
            >
              <Link to="/campeonatos">Criar Perfil de Piloto</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
