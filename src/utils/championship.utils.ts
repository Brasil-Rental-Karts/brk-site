import type { Championship as ApiChampionship } from '@/services/championship.service';

// Interface do campeonato no formato usado pelo frontend
export interface ChampionshipUI {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  location?: string;
  founded?: string;
  pilots?: number;
  seasons?: number;
  categories?: number;
  activeSeasons?: number;
  activeCategories?: number;
  status: "active" | "upcoming" | "finished";
  image: string;
  avatar?: string;
  sponsors?: Array<{
    id: string;
    name: string;
    logoImage: string;
    website?: string;
    type?: 'sponsor' | 'supporter';
  }>;
}

/**
 * Gera um slug a partir do nome do campeonato
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres especiais
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

/**
 * Converte dados da API para o formato usado no UI
 */
export function mapApiChampionshipToUI(
  apiChampionship: ApiChampionship, 
  activeSeasonsCount: number = 0, 
  activeCategoriesCount: number = 0
): ChampionshipUI {
  const slug = apiChampionship.slug || generateSlug(apiChampionship.name);
  
  return {
    id: apiChampionship.id,
    slug,
    name: apiChampionship.name,
    shortDescription: apiChampionship.shortDescription || apiChampionship.name,
    fullDescription: apiChampionship.fullDescription,
    location: 'Kartódromo', // Valor padrão por enquanto
    founded: apiChampionship.createdAt ? new Date(apiChampionship.createdAt).getFullYear().toString() : '2024',
    pilots: 0, // Será preenchido quando tivermos dados de pilotos
    seasons: 0, // Será preenchido quando tivermos dados de temporadas
    categories: 0, // Será preenchido quando tivermos dados de categorias
    activeSeasons: activeSeasonsCount,
    activeCategories: activeCategoriesCount,
    status: 'active', // Valor padrão por enquanto - será determinado pela lógica de negócio
    image: apiChampionship.championshipImage || getDefaultChampionshipImage(apiChampionship.name),
    avatar: apiChampionship.championshipImage || getDefaultChampionshipAvatar(apiChampionship.name),
    sponsors: Array.isArray(apiChampionship.sponsors) ? apiChampionship.sponsors : []
  };
}

/**
 * Gera uma imagem padrão para o campeonato baseada no nome
 */
function getDefaultChampionshipImage(name: string): string {
  const encodedName = encodeURIComponent(name);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3E${encodedName}%3C/text%3E%3C/svg%3E`;
}

/**
 * Gera um avatar padrão para o campeonato baseado no nome
 */
function getDefaultChampionshipAvatar(name: string): string {
  const encodedName = encodeURIComponent(name);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FF6B35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12' font-family='Arial'%3E${encodedName}%3C/text%3E%3C/svg%3E`;
}

/**
 * Encontra um campeonato por slug
 */
export function findChampionshipBySlug(championships: ChampionshipUI[], slug: string): ChampionshipUI | undefined {
  return championships.find(championship => championship.slug === slug);
}

/**
 * Filtra campeonatos por status
 */
export function filterChampionshipsByStatus(championships: ChampionshipUI[], status: string): ChampionshipUI[] {
  if (status === 'all') return championships;
  return championships.filter(championship => championship.status === status);
}

/**
 * Busca campeonatos por texto
 */
export function searchChampionships(championships: ChampionshipUI[], query: string): ChampionshipUI[] {
  if (!query.trim()) return championships;
  
  const searchTerm = query.toLowerCase();
  return championships.filter(championship =>
    championship.name.toLowerCase().includes(searchTerm) ||
    championship.shortDescription.toLowerCase().includes(searchTerm) ||
    championship.location?.toLowerCase().includes(searchTerm)
  );
}

/**
 * Calcula estatísticas dos campeonatos
 */
export function calculateChampionshipStats(championships: ChampionshipUI[]) {
  return {
    total: championships.length,
    active: championships.filter(c => c.status === 'active').length,
    upcoming: championships.filter(c => c.status === 'upcoming').length,
    finished: championships.filter(c => c.status === 'finished').length,
    totalPilots: championships.reduce((sum, c) => sum + (c.pilots || 0), 0),
    totalCategories: championships.reduce((sum, c) => sum + (c.categories || 0), 0),
    totalActiveSeasons: championships.reduce((sum, c) => sum + (c.activeSeasons || 0), 0),
    totalActiveCategories: championships.reduce((sum, c) => sum + (c.activeCategories || 0), 0)
  };
}

/**
 * Gera iniciais do nome do campeonato para o avatar
 */
export function getChampionshipInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Parse date string to local Date object, avoiding timezone issues
 * Esta função garante que datas como "2025-07-13T00:00:00" sejam interpretadas
 * como 13 de julho no timezone local, não como UTC que seria convertido para local
 */
export function parseLocalDate(dateStr: string): Date {
  if (dateStr.includes('T')) {
    // Se já tem horário, extrair apenas a parte da data
    const dateOnly = dateStr.split('T')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    return new Date(year, month - 1, day); // month é 0-indexed
  } else {
    // Se é apenas data (YYYY-MM-DD), interpretar como local
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // month é 0-indexed
  }
} 

export const isEventToday = (eventDate: string, eventMonth: string, selectedYear?: string): boolean => {
  const today = new Date();
  const year = selectedYear || today.getFullYear().toString();
  
  // Converter mês para número
  const getMonthNumber = (monthName: string): number => {
    const months: { [key: string]: number } = {
      'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
      'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11,
      'JANEIRO': 0, 'FEVEREIRO': 1, 'MARÇO': 2, 'ABRIL': 3, 'MAIO': 4, 'JUNHO': 5,
      'JULHO': 6, 'AGOSTO': 7, 'SETEMBRO': 8, 'OUTUBRO': 9, 'NOVEMBRO': 10, 'DEZEMBRO': 11
    };
    return months[monthName.toUpperCase()] || 0;
  };

  const monthNum = getMonthNumber(eventMonth);
  const dayNum = parseInt(eventDate) || 1;
  const yearNum = parseInt(year);
  
  const eventDateObj = new Date(yearNum, monthNum, dayNum);
  const todayDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return eventDateObj.getTime() === todayDateObj.getTime();
}; 