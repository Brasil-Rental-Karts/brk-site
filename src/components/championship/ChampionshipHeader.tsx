import { Button } from "brk-design-system";
import { motion } from "framer-motion";

interface ChampionshipHeaderProps {
  championship: {
    id: string;
    name: string;
    description: string;
    founded: string;
    pilots: string;
    seasons: string;
    categories: string;
    kartodromo: string;
    longDescription: string;
    stats: Array<{ label: string; value: string }>;
  };
}

/**
 * Header da página do campeonato
 * Exibe a imagem de destaque, nome, descrição e estatísticas
 */
export const ChampionshipHeader = ({ championship }: ChampionshipHeaderProps) => {
  return (
    <div className="relative bg-dark-900 text-white w-full overflow-hidden">
      {/* Hero Section com imagem e informações */}
      <div className="relative h-[600px] flex items-center">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img 
            src="/championship-hero-image.jpg" 
            alt="Escola da Velocidade"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback para cor sólida se a imagem não carregar
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Overlay escuro para legibilidade */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center h-full">
          {/* Lado esquerdo - Imagem do evento */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex justify-center"
          >
            <div className="w-full max-w-md">
              <img 
                src="/escola-velocidade-main.jpg"
                alt="Pilotos da Escola da Velocidade"
                className="w-full h-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  // Placeholder se imagem não carregar
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3EEscola da Velocidade%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </motion.div>

          {/* Lado direito - Informações */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Badge "Sobre a Escola da Velocidade" */}
            <div className="inline-block">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/30">
                SOBRE A ESCOLA DA VELOCIDADE
              </span>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {championship.description}
            </h1>

            {/* Descrição */}
            <p className="text-lg text-white/80 leading-relaxed">
              {championship.longDescription}
            </p>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              {championship.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-white/70 font-medium tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Botão CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="pt-4"
            >
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full"
              >
                Fazer Inscrição
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 