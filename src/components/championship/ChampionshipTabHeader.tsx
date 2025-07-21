import React from "react";
import { LucideIcon } from "lucide-react";

interface ChampionshipTabHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ChampionshipTabHeader: React.FC<ChampionshipTabHeaderProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="relative bg-white shadow-sm">
      {/* Content */}
      <div className="px-8 py-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 rounded-full p-3">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">
          {title}
        </h1>
        
        <p className="text-muted-foreground text-xs max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}; 