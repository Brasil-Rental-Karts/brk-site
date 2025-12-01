import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "brk-design-system";
import { Clock, Users, Calendar, X } from "lucide-react";

interface Season {
  id: string;
  name: string;
  slug?: string;
  startDate: string;
  endDate: string;
  championshipId: string;
  registrationOpen?: boolean;
  preRegistrationEnabled?: boolean;
  preRegistrationEndDate?: string | null;
}

interface PreRegistrationBannerProps {
  season: Season;
}

/**
 * Determina se o período exclusivo de pré-inscrição está ativo
 */
const isPreRegistrationPeriodActive = (season: Season): boolean => {
  if (!season.preRegistrationEnabled || !season.preRegistrationEndDate) {
    return false;
  }

  if (!season.registrationOpen) {
    return false;
  }

  const now = new Date();
  const preRegistrationEndDate = new Date(season.preRegistrationEndDate);

  // Período exclusivo está ativo se ainda não passou a data de término
  return now < preRegistrationEndDate;
};

/**
 * Calcula a data de abertura das inscrições gerais
 */
const getGeneralRegistrationDate = (season: Season): Date | null => {
  if (!season.preRegistrationEndDate) {
    return null;
  }

  const preRegistrationEndDate = new Date(season.preRegistrationEndDate);
  // Inscrições gerais abrem um dia após o término do período exclusivo
  const generalRegistrationDate = new Date(preRegistrationEndDate);
  generalRegistrationDate.setDate(generalRegistrationDate.getDate() + 1);
  return generalRegistrationDate;
};

/**
 * Formata data para exibição
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Modal informativo sobre pré-inscrição
 * Exibe informações positivas e educativas sobre o período exclusivo
 * Mobile-first design com opção de fechar
 */
export const PreRegistrationBanner = ({
  season,
}: PreRegistrationBannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Chave única para sessionStorage baseada na temporada
  const storageKey = `pre-registration-modal-closed-${season.id}`;

  useEffect(() => {
    setMounted(true);
    
    // Verificar se o modal já foi fechado para esta temporada nesta sessão
    const wasClosed = sessionStorage.getItem(storageKey);
    if (!wasClosed && season.preRegistrationEnabled) {
      // Pequeno delay para melhor UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [season.id, season.preRegistrationEnabled, storageKey]);

  // Não exibir se pré-inscrição não estiver habilitada
  if (!season.preRegistrationEnabled || !mounted) {
    return null;
  }

  const isExclusivePeriodActive = isPreRegistrationPeriodActive(season);
  const generalRegistrationDate = getGeneralRegistrationDate(season);

  const handleClose = () => {
    setIsOpen(false);
    // Salvar no sessionStorage que o usuário fechou o modal
    sessionStorage.setItem(storageKey, "true");
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal Content - Mobile First */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-background rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-background border-b flex items-center justify-between p-4 sm:p-6 z-10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/20 p-2 sm:p-3">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      Pré-Inscrição Exclusiva
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Prioridade para pilotos da ultima temporada
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 flex-shrink-0"
                  aria-label="Fechar modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Conteúdo baseado no status */}
                {isExclusivePeriodActive && generalRegistrationDate ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base text-foreground font-medium mb-1">
                          Período Exclusivo em Andamento
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          As inscrições gerais abrem em{" "}
                          <time
                            dateTime={generalRegistrationDate.toISOString()}
                            className="font-semibold text-primary"
                          >
                            {formatDate(generalRegistrationDate)}
                          </time>
                          . No momento, apenas pilotos que participaram da temporada
                          anterior podem se inscrever.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-primary/20">
                      <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base text-foreground font-medium mb-1">
                          Quem pode se inscrever agora?
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Pilotos que participaram de pelo menos uma etapa da
                          temporada anterior.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-primary/20">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-foreground font-medium mb-1">
                        Inscrições Gerais Abertas
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        O período exclusivo de pré-inscrição já foi concluído. Agora
                        todos os pilotos podem se inscrever na temporada.
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão de ação */}
                <div className="pt-2">
                  <Button
                    onClick={handleClose}
                    className="w-full"
                    variant="default"
                  >
                    Entendi
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

