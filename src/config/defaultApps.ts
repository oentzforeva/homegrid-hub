import { AppConfig } from "./appConfig";

// Import app icons
import unifiNetworkIcon from "@/assets/unifi-network-icon.png";
import unifiProtectIcon from "@/assets/unifi-protect-icon.png";
import homeassistantIcon from "@/assets/homeassistant-icon.png";
import synologyIcon from "@/assets/synology-icon.png";
import plexIcon from "@/assets/plex-icon.png";
import paperlessIcon from "@/assets/paperless-icon.png";

export const defaultApps: AppConfig[] = [
  {
    id: "unifi-network",
    name: "UniFi Network",
    description: "Network management and monitoring",
    icon: unifiNetworkIcon,
    accentColor: "hsl(217, 91%, 60%)",
    url: "https://unifi.ui.com",
    specification: {
      category: "Network Management",
      vendor: "Ubiquiti",
      type: "Web Application",
      protocol: "HTTPS"
    }
  },
  {
    id: "unifi-protect",
    name: "UniFi Protect",
    description: "Video surveillance and security",
    icon: unifiProtectIcon,
    accentColor: "hsl(217, 91%, 60%)",
    url: "https://protect.ui.com",
    specification: {
      category: "Security & Surveillance",
      vendor: "Ubiquiti",
      type: "Web Application",
      protocol: "HTTPS"
    }
  },
  {
    id: "homeassistant",
    name: "Home Assistant",
    description: "Smart home automation platform",
    icon: homeassistantIcon,
    accentColor: "hsl(199, 89%, 48%)",
    url: "https://home-assistant.io",
    specification: {
      category: "Home Automation",
      vendor: "Home Assistant",
      type: "Web Application",
      protocol: "HTTPS"
    }
  },
  {
    id: "synology",
    name: "Synology",
    description: "Network-attached storage management",
    icon: synologyIcon,
    accentColor: "hsl(25, 95%, 53%)",
    url: "https://synology.com",
    specification: {
      category: "Storage & NAS",
      vendor: "Synology",
      type: "Web Application",
      protocol: "HTTPS"
    }
  },
  {
    id: "plex",
    name: "Plex",
    description: "Media streaming and entertainment",
    icon: plexIcon,
    accentColor: "hsl(45, 93%, 58%)",
    url: "https://plex.tv",
    specification: {
      category: "Media & Entertainment",
      vendor: "Plex Inc.",
      type: "Media Server",
      protocol: "HTTPS"
    }
  },
  {
    id: "paperless",
    name: "Paperless",
    description: "Document management system",
    icon: paperlessIcon,
    accentColor: "hsl(142, 76%, 36%)",
    url: "https://paperless-ngx.readthedocs.io",
    specification: {
      category: "Document Management",
      vendor: "Paperless-NGX",
      type: "Web Application",
      protocol: "HTTPS"
    }
  }
];