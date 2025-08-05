import { useState } from "react";
import { Server, Activity } from "lucide-react";
import AppCard from "./AppCard";

// Import app icons
import unifiNetworkIcon from "@/assets/unifi-network-icon.png";
import unifiProtectIcon from "@/assets/unifi-protect-icon.png";
import homeassistantIcon from "@/assets/homeassistant-icon.png";
import synologyIcon from "@/assets/synology-icon.png";
import plexIcon from "@/assets/plex-icon.png";
import paperlessIcon from "@/assets/paperless-icon.png";

const apps = [
  {
    id: "unifi-network",
    name: "UniFi Network",
    description: "Network management and monitoring",
    icon: unifiNetworkIcon,
    accentColor: "hsl(217, 91%, 60%)",
    url: "https://unifi.ui.com"
  },
  {
    id: "unifi-protect",
    name: "UniFi Protect",
    description: "Video surveillance and security",
    icon: unifiProtectIcon,
    accentColor: "hsl(217, 91%, 60%)",
    url: "https://protect.ui.com"
  },
  {
    id: "homeassistant",
    name: "Home Assistant",
    description: "Smart home automation platform",
    icon: homeassistantIcon,
    accentColor: "hsl(199, 89%, 48%)",
    url: "https://home-assistant.io"
  },
  {
    id: "synology",
    name: "Synology",
    description: "Network-attached storage management",
    icon: synologyIcon,
    accentColor: "hsl(25, 95%, 53%)",
    url: "https://synology.com"
  },
  {
    id: "plex",
    name: "Plex",
    description: "Media streaming and entertainment",
    icon: plexIcon,
    accentColor: "hsl(45, 93%, 58%)",
    url: "https://plex.tv"
  },
  {
    id: "paperless",
    name: "Paperless",
    description: "Document management system",
    icon: paperlessIcon,
    accentColor: "hsl(142, 76%, 36%)",
    url: "https://paperless-ngx.readthedocs.io"
  }
];

const NetworkDashboard = () => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const handleAppClick = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-card rounded-xl border border-border shadow-card">
                <Server className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Network Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Home Network Services
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent animate-pulse" />
                <span>Online</span>
              </div>
              <div className="font-mono">
                {currentTime}
              </div>
            </div>
          </div>

          {/* Selection counter */}
          {selectedApps.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-primary font-medium">
                {selectedApps.length} app{selectedApps.length === 1 ? '' : 's'} selected
              </span>
            </div>
          )}
        </header>

        {/* Apps Grid */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <AppCard
                key={app.id}
                name={app.name}
                description={app.description}
                icon={app.icon}
                accentColor={app.accentColor}
                isSelected={selectedApps.includes(app.id)}
                onClick={() => handleAppClick(app.id)}
              />
            ))}
          </div>

          {/* Footer info */}
          <footer className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              Click on apps to select them • Built for home network management
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default NetworkDashboard;