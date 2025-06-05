// Declaração global para o Clarity
declare global {
  interface Window {
    clarity?: (action: string, ...args: any[]) => void;
  }
}

// Função para verificar se o Clarity está disponível
const isClarityAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.clarity === 'function';
};

// Função genérica para enviar eventos para o Clarity
export const trackClarityEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isClarityAvailable()) {
    console.warn('Clarity não está disponível');
    return;
  }

  try {
    window.clarity!('event', eventName, properties);
    console.log(`Clarity event tracked: ${eventName}`, properties);
  } catch (error) {
    console.error('Erro ao enviar evento para o Clarity:', error);
  }
};

// Eventos específicos para o pre-launch
export const clarityEvents = {
  // Formulário do Hero
  heroFormStart: () => trackClarityEvent('hero_form_start'),
  heroFormSuccess: () => trackClarityEvent('hero_form_success'),
  heroFormError: (error: string) => trackClarityEvent('hero_form_error', { error }),
  heroFormValidationError: (field: string, error: string) => 
    trackClarityEvent('hero_form_validation_error', { field, error }),

  // Formulário Final
  finalFormStart: () => trackClarityEvent('final_form_start'),
  finalFormSuccess: () => trackClarityEvent('final_form_success'),
  finalFormError: (error: string) => trackClarityEvent('final_form_error', { error }),
  finalFormValidationError: (field: string, error: string) => 
    trackClarityEvent('final_form_validation_error', { field, error }),

  // Navegação
  pageView: (section: string) => trackClarityEvent('page_view', { section }),
  scrollToSection: (section: string) => trackClarityEvent('scroll_to_section', { section }),
  socialMediaClick: (platform: string) => trackClarityEvent('social_media_click', { platform }),
  
  // Interações
  cardHover: (cardName: string) => trackClarityEvent('card_hover', { cardName }),
  backToFormClick: (formType: 'hero' | 'final') => 
    trackClarityEvent('back_to_form_click', { formType }),
};

// Função para identificar usuários (opcional)
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (!isClarityAvailable()) return;

  try {
    window.clarity!('identify', userId, traits);
  } catch (error) {
    console.error('Erro ao identificar usuário no Clarity:', error);
  }
};

// Função para definir tags customizadas
export const setClarityTag = (key: string, value: string) => {
  if (!isClarityAvailable()) return;

  try {
    window.clarity!('set', key, value);
  } catch (error) {
    console.error('Erro ao definir tag no Clarity:', error);
  }
}; 