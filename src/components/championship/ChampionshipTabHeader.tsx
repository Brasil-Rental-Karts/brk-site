import React from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white shadow-sm"
    >
      {/* Content */}
      <div className="px-8 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-primary/10 rounded-full p-3">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground text-xs max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}; 