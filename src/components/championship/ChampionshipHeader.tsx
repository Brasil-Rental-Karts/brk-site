import { Button } from "brk-design-system";
import { UserPlus } from "lucide-react";

interface Season {
  id: string;
  name: string;
  slug?: string;
  startDate: string;
  endDate: string;
  championshipId: string;
  registrationOpen?: boolean;
}

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
    image?: string;
    avatar?: string;
    stats: Array<{ label: string; value: string }>;
  };
  seasonsWithOpenRegistration?: Season[];
  onRegisterClick?: (seasonSlug: string) => void;
}

/**
 * Header da página do campeonato
 * Subheader simples com avatar, nome e botão de ação
 */
export const ChampionshipHeader = ({ 
  championship, 
  seasonsWithOpenRegistration = [], 
  onRegisterClick 
}: ChampionshipHeaderProps) => {
  // Gerar iniciais do nome do campeonato para o avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-dark-900 text-white w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="container px-6 py-4">
        {/* Layout Desktop */}
        <div className="hidden md:flex items-center justify-between">
          {/* Avatar e nome */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 border-2 border-white/20 rounded-full overflow-hidden bg-white flex items-center justify-center">
              {championship.image || championship.avatar ? (
                <img 
                  src={championship.image || championship.avatar} 
                  alt={championship.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Se a imagem falhar, esconder e mostrar as iniciais
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-sm font-bold text-black">${getInitials(championship.name)}</span>`;
                    }
                  }}
                />
              ) : (
                <span className="text-sm font-bold text-black">
                  {getInitials(championship.name)}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold">
              {championship.name}
            </h1>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {seasonsWithOpenRegistration.length > 0 ? (
              seasonsWithOpenRegistration.map((season) => (
                <Button
                  key={season.id}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent"
                  onClick={() => onRegisterClick?.(season.slug || season.id)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inscrever-se em {season.name}
                </Button>
              ))
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white/50 bg-transparent cursor-not-allowed"
                disabled
              >
                Aguarde abertura das inscrições
              </Button>
            )}
          </div>
        </div>

        {/* Layout Mobile */}
        <div className="md:hidden space-y-4">
          {/* Linha 1: Avatar e nome */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 border-2 border-white/20 rounded-full overflow-hidden bg-white flex items-center justify-center">
              {championship.image || championship.avatar ? (
                <img 
                  src={championship.image || championship.avatar} 
                  alt={championship.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Se a imagem falhar, esconder e mostrar as iniciais
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xs font-bold text-black">${getInitials(championship.name)}</span>`;
                    }
                  }}
                />
              ) : (
                <span className="text-xs font-bold text-black">
                  {getInitials(championship.name)}
                </span>
              )}
            </div>
            
            <h1 className="text-lg font-bold flex-1 min-w-0">
              <span className="truncate block">{championship.name}</span>
            </h1>
          </div>

          {/* Linha 2: Botão */}
          <div className="flex flex-col gap-2 w-full">
            {seasonsWithOpenRegistration.length > 0 ? (
              seasonsWithOpenRegistration.map((season) => (
                <Button
                  key={season.id}
                  variant="outline"
                  size="sm"
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent text-xs"
                  onClick={() => onRegisterClick?.(season.slug || season.id)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inscrever-se em {season.name}
                </Button>
              ))
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/30 text-white/50 bg-transparent text-xs cursor-not-allowed"
                disabled
              >
                Aguarde abertura das inscrições
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 