import { motion } from "framer-motion";
import { Card, CardContent } from "brk-design-system";
import { Badge } from "brk-design-system";
import { FileText, Download, Eye, BookOpen } from "lucide-react";

interface RegulamentoTabProps {
  championship: {
    name: string;
    currentSeason: {
      name: string;
    };
  };
}

export const RegulamentoTab = ({ championship }: RegulamentoTabProps) => {
  // Dados mockados do regulamento
  const regulamentoSections = [
    {
      id: 1,
      title: "1. Disposições Gerais",
      content: [
        "O campeonato Escola da Velocidade é uma competição de kart amador",
        "Todos os pilotos devem ser maiores de 18 anos ou possuir autorização dos responsáveis",
        "A participação está condicionada ao pagamento das taxas estabelecidas",
        "O presente regulamento pode ser alterado pela organização a qualquer momento"
      ]
    },
    {
      id: 2,
      title: "2. Categorias",
      content: [
        "Sênior: Pilotos de 18 a 39 anos",
        "Master: Pilotos a partir de 40 anos",
        "Feminino: Categoria exclusiva para pilotas",
        "Rookie: Pilotos estreantes no campeonato"
      ]
    },
    {
      id: 3,
      title: "3. Equipamentos Obrigatórios",
      content: [
        "Capacete homologado (mínimo Snell K2015 ou NBR 7471)",
        "Macacão de kart ou roupa adequada",
        "Luvas e sapatos fechados",
        "Todos os equipamentos são de responsabilidade do piloto"
      ]
    },
    {
      id: 4,
      title: "4. Sistema de Pontuação",
      content: [
        "1º lugar: 25 pontos",
        "2º lugar: 18 pontos", 
        "3º lugar: 15 pontos",
        "4º lugar: 12 pontos",
        "5º lugar: 10 pontos",
        "6º ao 10º lugar: 8, 6, 4, 2, 1 pontos respectivamente",
        "Pole position: +3 pontos",
        "Volta mais rápida: +1 ponto"
      ]
    },
    {
      id: 5,
      title: "5. Conduta e Penalidades",
      content: [
        "Comportamento antidesportivo resultará em penalidades",
        "Desrespeito às bandeiras: advertência ou punição temporal",
        "Condução perigosa: exclusão da corrida",
        "Agressão física ou verbal: desqualificação do campeonato"
      ]
    },
    {
      id: 6,
      title: "6. Inscrições e Pagamentos",
      content: [
        "As inscrições devem ser feitas até 48h antes de cada etapa",
        "Pagamento deve ser realizado no ato da inscrição",
        "Não há reembolso em caso de desistência",
        "Vagas limitadas por ordem de inscrição"
      ]
    }
  ];

  const documentos = [
    {
      id: 1,
      name: "Regulamento Completo 2025",
      type: "PDF",
      size: "2.3 MB",
      updated: "15/01/2025"
    },
    {
      id: 2,
      name: "Tabela de Pontuação",
      type: "PDF",
      size: "856 KB",
      updated: "15/01/2025"
    },
    {
      id: 3,
      name: "Lista de Equipamentos",
      type: "PDF", 
      size: "1.2 MB",
      updated: "10/01/2025"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Regulamento
        </h1>
        <p className="text-muted-foreground mb-6">
          Regulamento oficial do {championship.currentSeason.name}
        </p>
      </motion.div>

      {/* Documentos para Download */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Documentos Oficiais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {documentos.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                        <span className="text-xs text-muted-foreground">{doc.size}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Atualizado em {doc.updated}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-muted rounded" title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-muted rounded" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Regulamento Resumido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4">Principais Pontos do Regulamento</h2>
        <div className="space-y-4">
          {regulamentoSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-primary">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contato para Dúvidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20"
      >
        <h3 className="font-semibold mb-2 text-primary">Dúvidas sobre o Regulamento?</h3>
        <p className="text-sm text-muted-foreground">
          Entre em contato com a organização através das redes sociais ou durante os eventos. 
          Toda dúvida será esclarecida e, se necessário, o regulamento será atualizado para maior clareza.
        </p>
      </motion.div>
    </div>
  );
}; 