import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { Trophy, Medal, Star } from "lucide-react";

interface ClassificacaoTabProps {
  championship: {
    currentSeason: {
      name: string;
      year: string;
      season: string;
    };
  };
}

export const ClassificacaoTab = ({ championship }: ClassificacaoTabProps) => {
  // Dados mockados de classificação
  const classificacao = [
    {
      posicao: 1,
      piloto: "João Silva",
      categoria: "Sênior",
      pontos: 245,
      vitorias: 4,
      podios: 7,
      melhorPosicao: 1,
      participacoes: 8
    },
    {
      posicao: 2,
      piloto: "Pedro Santos",
      categoria: "Sênior", 
      pontos: 220,
      vitorias: 3,
      podios: 6,
      melhorPosicao: 1,
      participacoes: 8
    },
    {
      posicao: 3,
      piloto: "Ana Costa",
      categoria: "Feminino",
      pontos: 195,
      vitorias: 2,
      podios: 5,
      melhorPosicao: 1,
      participacoes: 7
    },
    {
      posicao: 4,
      piloto: "Carlos Oliveira",
      categoria: "Master",
      pontos: 180,
      vitorias: 1,
      podios: 4,
      melhorPosicao: 2,
      participacoes: 8
    },
    {
      posicao: 5,
      piloto: "Rafael Lima",
      categoria: "Sênior",
      pontos: 165,
      vitorias: 1,
      podios: 3,
      melhorPosicao: 2,
      participacoes: 7
    }
  ];

  const renderPositionBadge = (position: number) => {
    if (position === 1) {
      return (
        <div className="flex items-center gap-2 text-yellow-500">
          <Trophy className="h-5 w-5" />
          <span className="font-bold text-lg">1º</span>
        </div>
      );
    }
    if (position === 2) {
      return (
        <div className="flex items-center gap-2 text-gray-400">
          <Medal className="h-5 w-5" />
          <span className="font-bold text-lg">2º</span>
        </div>
      );
    }
    if (position === 3) {
      return (
        <div className="flex items-center gap-2 text-amber-600">
          <Medal className="h-5 w-5" />
          <span className="font-bold text-lg">3º</span>
        </div>
      );
    }
    return (
      <span className="font-bold text-lg">{position}º</span>
    );
  };

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Classificação Geral
        </h1>
        <p className="text-muted-foreground mb-6">
          Classificação dos pilotos no {championship.currentSeason.name}
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Temporada</label>
          <select className="px-4 py-2 rounded-lg border border-border bg-background min-w-40">
            <option value="temporada1">{championship.currentSeason.season}</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Categoria</label>
          <select className="px-4 py-2 rounded-lg border border-border bg-background min-w-40">
            <option value="todas">Todas as categorias</option>
            <option value="senior">Sênior</option>
            <option value="master">Master</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
      </motion.div>

      {/* Pódio - Top 3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Pódio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classificacao.slice(0, 3).map((piloto) => (
            <Card key={piloto.posicao} className={`relative overflow-hidden ${
              piloto.posicao === 1 ? 'ring-2 ring-yellow-500' : 
              piloto.posicao === 2 ? 'ring-2 ring-gray-400' : 
              'ring-2 ring-amber-600'
            }`}>
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  {renderPositionBadge(piloto.posicao)}
                </div>
                <h3 className="font-bold text-lg mb-2">{piloto.piloto}</h3>
                <Badge variant="outline" className="mb-3">{piloto.categoria}</Badge>
                <div className="text-2xl font-bold text-primary mb-2">{piloto.pontos} pts</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>{piloto.vitorias} vitória{piloto.vitorias !== 1 ? 's' : ''}</div>
                  <div>{piloto.podios} pódio{piloto.podios !== 1 ? 's' : ''}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Classificação Completa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4">Classificação Completa</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Pos.</th>
                    <th className="px-4 py-3 text-left font-medium">Piloto</th>
                    <th className="px-4 py-3 text-left font-medium">Categoria</th>
                    <th className="px-4 py-3 text-center font-medium">Pontos</th>
                    <th className="px-4 py-3 text-center font-medium">Vitórias</th>
                    <th className="px-4 py-3 text-center font-medium">Pódios</th>
                    <th className="px-4 py-3 text-center font-medium">Melhor</th>
                    <th className="px-4 py-3 text-center font-medium">Participações</th>
                  </tr>
                </thead>
                <tbody>
                  {classificacao.map((piloto, index) => (
                    <motion.tr
                      key={piloto.posicao}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        {renderPositionBadge(piloto.posicao)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{piloto.piloto}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline">{piloto.categoria}</Badge>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="font-bold text-primary">{piloto.pontos}</div>
                      </td>
                      <td className="px-4 py-4 text-center">{piloto.vitorias}</td>
                      <td className="px-4 py-4 text-center">{piloto.podios}</td>
                      <td className="px-4 py-4 text-center">{piloto.melhorPosicao}º</td>
                      <td className="px-4 py-4 text-center">{piloto.participacoes}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 