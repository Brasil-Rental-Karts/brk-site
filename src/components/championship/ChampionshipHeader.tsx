import { Button } from "brk-design-system";
import { Avatar, AvatarFallback } from "brk-design-system";

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
 * Subheader simples com avatar, nome e botão de ação
 */
export const ChampionshipHeader = ({ championship }: ChampionshipHeaderProps) => {
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
    <div className="bg-dark-900 text-white w-full">
      <div className="w-full px-6 py-4">
        {/* Layout Desktop */}
        <div className="hidden md:flex items-center justify-between">
          {/* Avatar e nome */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarFallback className="text-sm font-bold text-black bg-white">
                {getInitials(championship.name)}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-2xl font-bold">
              {championship.name}
            </h1>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent"
            >
              Fazer Inscrição
            </Button>
          </div>
        </div>

        {/* Layout Mobile */}
        <div className="md:hidden space-y-4">
          {/* Linha 1: Avatar e nome */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarFallback className="text-xs font-bold text-black bg-white">
                {getInitials(championship.name)}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-lg font-bold flex-1 min-w-0">
              <span className="truncate block">{championship.name}</span>
            </h1>
          </div>

          {/* Linha 2: Botão */}
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 bg-transparent text-xs"
            >
              Fazer Inscrição
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 