import { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit3, ExternalLink } from "lucide-react";

interface AppCardProps {
  name: string;
  icon: string;
  description: string;
  accentColor: string;
  url?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onLaunch?: () => void;
  isEditMode?: boolean;
  isOnline?: boolean;
}

const AppCard = ({ name, icon, description, accentColor, url, onClick, onEdit, onLaunch, isEditMode = false, isOnline }: AppCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isEditMode && onEdit) {
      onEdit();
    } else if (!isEditMode && onClick) {
      onClick();
    }
  };

  const handleLaunch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (url && onLaunch) {
      onLaunch();
    }
  };

  return (
    <div
      className={cn(
        "relative group select-none cursor-pointer",
        "transition-all duration-300 ease-smooth",
        "transform-gpu will-change-transform"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-card border border-border",
          "shadow-card transition-all duration-300 ease-smooth",
          "p-6 min-h-[180px] flex flex-col items-center justify-center text-center",
          isHovered && "shadow-hover bg-gradient-hover transform scale-[1.02]"
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

        {/* Connectivity status indicator */}
        {url && isOnline !== undefined && (
          <div className="absolute top-3 left-3 z-20">
            <div 
              className={cn(
                "w-3 h-3 rounded-full",
                isOnline 
                  ? "bg-green-500 animate-pulse" 
                  : "bg-red-500 animate-[blink_1s_linear_infinite]"
              )}
            />
          </div>
        )}

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

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditMode && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-primary/20 hover:bg-primary/30 rounded-lg backdrop-blur-sm transition-colors"
            >
              <Edit3 className="h-3 w-3 text-primary" />
            </button>
          )}
          
          {!isEditMode && url && onLaunch && (
            <button
              onClick={handleLaunch}
              className="p-2 bg-accent/20 hover:bg-accent/30 rounded-lg backdrop-blur-sm transition-colors"
            >
              <ExternalLink className="h-3 w-3 text-accent" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppCard;