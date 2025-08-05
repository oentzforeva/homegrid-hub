import { useState, useEffect } from "react";

export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  url: string;
}

// Import app icons
import unifiNetworkIcon from "@/assets/unifi-network-icon.png";
import unifiProtectIcon from "@/assets/unifi-protect-icon.png";
import homeassistantIcon from "@/assets/homeassistant-icon.png";
import synologyIcon from "@/assets/synology-icon.png";
import plexIcon from "@/assets/plex-icon.png";
import paperlessIcon from "@/assets/paperless-icon.png";

const defaultApps: App[] = [
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

const STORAGE_KEY = "network-dashboard-apps";

export const useAppsData = () => {
  const [apps, setApps] = useState<App[]>([]);

  // Load apps from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setApps(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse stored apps:", error);
        setApps(defaultApps);
      }
    } else {
      setApps(defaultApps);
    }
  }, []);

  // Save apps to localStorage whenever apps change
  useEffect(() => {
    if (apps.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    }
  }, [apps]);

  const addApp = (app: Omit<App, "id">) => {
    const newApp: App = {
      ...app,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setApps(prev => [...prev, newApp]);
    return newApp.id;
  };

  const updateApp = (id: string, updates: Partial<Omit<App, "id">>) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ));
  };

  const deleteApp = (id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const resetToDefaults = () => {
    setApps(defaultApps);
  };

  return {
    apps,
    addApp,
    updateApp,
    deleteApp,
    resetToDefaults
  };
};