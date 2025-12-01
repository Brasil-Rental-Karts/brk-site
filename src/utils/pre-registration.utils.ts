/**
 * Utilitários para pré-inscrição
 */

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

/**
 * Determina se o período exclusivo de pré-inscrição está ativo
 */
export const isPreRegistrationPeriodActive = (season: Season): boolean => {
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
 * Retorna o texto do botão de inscrição baseado no status de pré-inscrição
 */
export const getRegistrationButtonText = (season: Season): string => {
  const isExclusivePeriodActive = isPreRegistrationPeriodActive(season);
  
  if (isExclusivePeriodActive) {
    return "Pré-inscrição exclusiva para pilotos da ultima temporada";
  }
  
  return `Inscrever-se em ${season.name}`;
};

