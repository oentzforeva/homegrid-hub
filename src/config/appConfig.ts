/**
 * App Configuration Interface
 * Defines the structure for persistent app configurations
 */

export interface AppSpecification {
  /** Application category (e.g., "Network Management", "Media Server") */
  category: string;
  /** Vendor or developer name */
  vendor: string;
  /** Application type (e.g., "Web Application", "API Service") */
  type: string;
  /** Protocol used (e.g., "HTTPS", "HTTP", "TCP") */
  protocol: string;
  /** Optional port number */
  port?: number;
  /** Optional version information */
  version?: string;
  /** Optional additional metadata */
  metadata?: Record<string, any>;
}

export interface ColorScheme {
  /** Primary accent color in HSL format */
  primary: string;
  /** Optional secondary color */
  secondary?: string;
  /** Optional background color */
  background?: string;
  /** Optional text color */
  text?: string;
}

export interface AppConfig {
  /** Unique identifier for the app */
  id: string;
  /** Display name */
  name: string;
  /** Brief description */
  description: string;
  /** Icon URL or imported asset path */
  icon: string;
  /** Primary accent color (HSL format for consistency) */
  accentColor: string;
  /** Application URL */
  url: string;
  /** Whether connectivity check is enabled for this app (defaults to true) */
  networkCheckEnabled?: boolean;
  /** Detailed app specification */
  specification: AppSpecification;
  /** Optional extended color scheme */
  colorScheme?: ColorScheme;
  /** Configuration creation/update timestamp */
  lastModified?: string;
  /** Whether this is a custom user-added app */
  isCustom?: boolean;
}

export interface DashboardConfig {
  /** Dashboard title */
  title: string;
  /** Dashboard subtitle */
  subtitle: string;
  /** Footer text */
  footer: string;
  /** Whether network monitoring is enabled */
  networkCheckEnabled: boolean;
  /** Dashboard theme preferences */
  theme?: {
    /** Overall color scheme preference */
    colorScheme?: 'light' | 'dark' | 'auto';
    /** Custom CSS variables */
    customColors?: Record<string, string>;
  };
  /** Configuration metadata */
  metadata?: {
    /** Configuration version for migration purposes */
    configVersion: string;
    /** Last update timestamp */
    lastModified: string;
    /** User preferences */
    preferences?: Record<string, any>;
  };
}

export interface NetworkDashboardConfig {
  /** Application configurations */
  apps: AppConfig[];
  /** Dashboard settings */
  dashboard: DashboardConfig;
  /** Configuration metadata */
  metadata: {
    configVersion: string;
    lastExport?: string;
    lastImport?: string;
  };
}

/**
 * Default dashboard configuration
 */
export const defaultDashboardConfig: DashboardConfig = {
  title: "Network Dashboard",
  subtitle: "Home Network Services",
  footer: "Click apps to launch • Click Edit to customize dashboard",
  networkCheckEnabled: true,
  theme: {
    colorScheme: 'auto'
  },
  metadata: {
    configVersion: "1.0.0",
    lastModified: new Date().toISOString()
  }
};

/**
 * Storage keys for different configuration components
 */
export const CONFIG_STORAGE_KEYS = {
  APPS: "network-dashboard-apps-config",
  DASHBOARD: "network-dashboard-settings",
  FULL_CONFIG: "network-dashboard-full-config"
} as const;

/**
 * Configuration validation and migration utilities
 */
export class ConfigManager {
  /**
   * Validates app configuration structure
   */
  static validateAppConfig(config: any): config is AppConfig {
    return (
      typeof config === 'object' &&
      typeof config.id === 'string' &&
      typeof config.name === 'string' &&
      typeof config.description === 'string' &&
      typeof config.icon === 'string' &&
      typeof config.accentColor === 'string' &&
      typeof config.url === 'string' &&
      typeof config.specification === 'object'
    );
  }

  /**
   * Validates dashboard configuration structure
   */
  static validateDashboardConfig(config: any): config is DashboardConfig {
    return (
      typeof config === 'object' &&
      typeof config.title === 'string' &&
      typeof config.subtitle === 'string' &&
      typeof config.footer === 'string' &&
      typeof config.networkCheckEnabled === 'boolean'
    );
  }

  /**
   * Exports configuration to JSON
   */
  static exportConfig(apps: AppConfig[], dashboard: DashboardConfig): string {
    const config: NetworkDashboardConfig = {
      apps,
      dashboard,
      metadata: {
        configVersion: "1.0.0",
        lastExport: new Date().toISOString()
      }
    };
    return JSON.stringify(config, null, 2);
  }

  /**
   * Imports configuration from JSON
   */
  static importConfig(jsonString: string): NetworkDashboardConfig | null {
    try {
      const config = JSON.parse(jsonString);
      
      // Basic validation
      if (!Array.isArray(config.apps) || !config.dashboard) {
        throw new Error('Invalid configuration structure');
      }

      // Validate each app
      for (const app of config.apps) {
        if (!this.validateAppConfig(app)) {
          throw new Error(`Invalid app configuration: ${app.id || 'unknown'}`);
        }
      }

      // Validate dashboard config
      if (!this.validateDashboardConfig(config.dashboard)) {
        throw new Error('Invalid dashboard configuration');
      }

      return {
        ...config,
        metadata: {
          ...config.metadata,
          lastImport: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return null;
    }
  }
}