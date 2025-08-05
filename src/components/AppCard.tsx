import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppCardProps {
  name: string;
  icon: string;
  description: string;
  accentColor: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const AppCard = ({ name, icon, description, accentColor, onClick, isSelected = false }: AppCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative group cursor-pointer select-none",
        "transition-all duration-300 ease-smooth",
        "transform-gpu will-change-transform"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-card border border-border",
          "shadow-card transition-all duration-300 ease-smooth",
          "p-6 min-h-[180px] flex flex-col items-center justify-center text-center",
          isHovered && "shadow-hover bg-gradient-hover transform scale-[1.02]",
          isSelected && "ring-2 ring-primary shadow-hover"
        )}
      >
        {/* Accent glow effect */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500",
            isHovered && "opacity-20"
          )}
          style={{
            background: `radial-gradient(circle at center, ${accentColor}, transparent 70%)`
          }}
        />

        {/* App icon */}
        <div className="relative z-10 mb-4">
          <div
            className={cn(
              "w-16 h-16 rounded-xl overflow-hidden",
              "transition-transform duration-300 ease-bounce",
              isHovered && "transform scale-110"
            )}
            style={{
              boxShadow: isHovered ? `0 8px 25px -8px ${accentColor}50` : undefined
            }}
          >
            <img
              src={icon}
              alt={`${name} icon`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* App info */}
        <div className="relative z-10">
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default AppCard;