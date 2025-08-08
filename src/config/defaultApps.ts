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
    id: "network-manager",
    name: "Network Manager",
    description: "Network infrastructure management",
    icon: unifiNetworkIcon,
    accentColor: "hsl(217, 91%, 60%)",
    url: "https://network.example.local:8443",
    networkCheckEnabled: true,
    specification: {
      category: "Network Management",
      vendor: "Example Corp",
      type: "Web Application",
      protocol: "HTTPS"
    }
  },
  {
    id: "security-system",
    name: "Security System",
    description: "Video surveillance and access control",
    icon: unifiProtectIcon,
    accentColor: "hsl(217, 91%, 60%)",
    url: "https://security.example.local:7443",
    networkCheckEnabled: true,
    specification: {
      category: "Security & Surveillance",
      vendor: "SecureTech",
      type: "Web Application",
      protocol: "HTTPS"
    }
  },
  {
    id: "smart-home",
    name: "Smart Home Hub",
    description: "Home automation and IoT control",
    icon: homeassistantIcon,
    accentColor: "hsl(199, 89%, 48%)",
    url: "http://smarthome.example.local:8123",
    networkCheckEnabled: true,
    specification: {
      category: "Home Automation",
      vendor: "HomeOS",
      type: "Web Application",
      protocol: "HTTP"
    }
  },
  {
    id: "file-server",
    name: "File Server",
    description: "Network storage and file sharing",
    icon: synologyIcon,
    accentColor: "hsl(25, 95%, 53%)",
    url: "https://files.example.local:5001",
    networkCheckEnabled: true,
    specification: {
      category: "Storage & NAS",
      vendor: "StorageTech",
      type: "Web Application",
      protocol: "HTTPS"
    }
  },
  {
    id: "media-server",
    name: "Media Server",
    description: "Video and music streaming platform",
    icon: plexIcon,
    accentColor: "hsl(45, 93%, 58%)",
    url: "http://media.example.local:32400",
    networkCheckEnabled: true,
    specification: {
      category: "Media & Entertainment",
      vendor: "MediaStream Inc.",
      type: "Media Server",
      protocol: "HTTP"
    }
  },
  {
    id: "document-manager",
    name: "Document Manager",
    description: "Digital document organization",
    icon: paperlessIcon,
    accentColor: "hsl(142, 76%, 36%)",
    url: "http://docs.example.local:8000",
    networkCheckEnabled: true,
    specification: {
      category: "Document Management",
      vendor: "DocuFlow",
      type: "Web Application",
      protocol: "HTTP"
    }
  }
];