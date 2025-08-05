import { useState, useEffect } from "react";
import { 
  AppConfig, 
  DashboardConfig, 
  defaultDashboardConfig, 
  CONFIG_STORAGE_KEYS,
  ConfigManager
} from "@/config/appConfig";
import { defaultApps } from "@/config/defaultApps";

export { type AppConfig } from "@/config/appConfig";

/**
 * Enhanced hook for managing app and dashboard configuration
 * Provides persistent storage and configuration management
 */
export const useAppConfig = () => {
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(defaultDashboardConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Load configuration from localStorage on mount
  useEffect(() => {
    const loadConfiguration = () => {
      try {
        // Load apps configuration
        const storedApps = localStorage.getItem(CONFIG_STORAGE_KEYS.APPS);
        console.log('Loading apps from localStorage:', storedApps);
        if (storedApps) {
          const parsedApps = JSON.parse(storedApps);
          if (Array.isArray(parsedApps)) {
            // Validate each app configuration
            const validApps = parsedApps.filter(app => ConfigManager.validateAppConfig(app));
            console.log('Valid apps found:', validApps);
            setApps(validApps.length > 0 ? validApps : defaultApps);
          } else {
            setApps(defaultApps);
          }
        } else {
          console.log('No stored apps found, using defaults');
          setApps(defaultApps);
        }

        // Load dashboard configuration
        const storedDashboard = localStorage.getItem(CONFIG_STORAGE_KEYS.DASHBOARD);
        if (storedDashboard) {
          const parsedDashboard = JSON.parse(storedDashboard);
          if (ConfigManager.validateDashboardConfig(parsedDashboard)) {
            setDashboardConfig({
              ...defaultDashboardConfig,
              ...parsedDashboard,
              metadata: {
                ...defaultDashboardConfig.metadata,
                ...parsedDashboard.metadata
              }
            });
          } else {
            setDashboardConfig(defaultDashboardConfig);
          }
        } else {
          setDashboardConfig(defaultDashboardConfig);
        }
      } catch (error) {
        console.error("Failed to load configuration:", error);
        setApps(defaultApps);
        setDashboardConfig(defaultDashboardConfig);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfiguration();
  }, []);

  // Save apps configuration whenever it changes
  useEffect(() => {
    if (!isLoading && apps.length > 0) {
      const appsWithTimestamp = apps.map(app => ({
        ...app,
        lastModified: new Date().toISOString()
      }));
      console.log('Saving apps to localStorage:', appsWithTimestamp);
      localStorage.setItem(CONFIG_STORAGE_KEYS.APPS, JSON.stringify(appsWithTimestamp));
    }
  }, [apps, isLoading]);

  // Save dashboard configuration whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const configWithTimestamp = {
        ...dashboardConfig,
        metadata: {
          ...dashboardConfig.metadata,
          lastModified: new Date().toISOString()
        }
      };
      localStorage.setItem(CONFIG_STORAGE_KEYS.DASHBOARD, JSON.stringify(configWithTimestamp));
    }
  }, [dashboardConfig, isLoading]);

  /**
   * Add a new app configuration
   */
  const addApp = (appData: Omit<AppConfig, "id" | "lastModified" | "isCustom">) => {
    const newApp: AppConfig = {
      ...appData,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastModified: new Date().toISOString(),
      isCustom: true
    };
    setApps(prev => [...prev, newApp]);
    return newApp.id;
  };

  /**
   * Update an existing app configuration
   */
  const updateApp = (id: string, updates: Partial<Omit<AppConfig, "id">>) => {
    setApps(prev => prev.map(app => 
      app.id === id 
        ? { 
            ...app, 
            ...updates, 
            lastModified: new Date().toISOString()
          } 
        : app
    ));
  };

  /**
   * Delete an app configuration
   */
  const deleteApp = (id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  };

  /**
   * Reset apps to default configuration
   */
  const resetAppsToDefaults = () => {
    setApps(defaultApps);
  };

  /**
   * Update dashboard configuration
   */
  const updateDashboardConfig = (updates: Partial<DashboardConfig>) => {
    setDashboardConfig(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        lastModified: new Date().toISOString()
      }
    }));
  };

  /**
   * Reset dashboard configuration to defaults
   */
  const resetDashboardToDefaults = () => {
    setDashboardConfig(defaultDashboardConfig);
  };

  /**
   * Reset everything to defaults
   */
  const resetAllToDefaults = () => {
    resetAppsToDefaults();
    resetDashboardToDefaults();
  };

  /**
   * Export current configuration as JSON
   */
  const exportConfiguration = () => {
    return ConfigManager.exportConfig(apps, dashboardConfig);
  };

  /**
   * Import configuration from JSON string
   */
  const importConfiguration = (jsonString: string): boolean => {
    const config = ConfigManager.importConfig(jsonString);
    if (config) {
      setApps(config.apps);
      setDashboardConfig(config.dashboard);
      return true;
    }
    return false;
  };

  /**
   * Get app by ID
   */
  const getAppById = (id: string): AppConfig | undefined => {
    return apps.find(app => app.id === id);
  };

  /**
   * Get apps by category
   */
  const getAppsByCategory = (category: string): AppConfig[] => {
    return apps.filter(app => app.specification.category === category);
  };

  /**
   * Get all unique categories
   */
  const getCategories = (): string[] => {
    return Array.from(new Set(apps.map(app => app.specification.category)));
  };

  return {
    // Data
    apps,
    dashboardConfig,
    isLoading,
    
    // App management
    addApp,
    updateApp,
    deleteApp,
    resetAppsToDefaults,
    getAppById,
    getAppsByCategory,
    getCategories,
    
    // Dashboard management
    updateDashboardConfig,
    resetDashboardToDefaults,
    
    // Global operations
    resetAllToDefaults,
    exportConfiguration,
    importConfiguration,
    
    // Legacy compatibility (for existing components)
    resetToDefaults: resetAllToDefaults
  };
};

// Legacy export for backward compatibility
export const useAppsData = useAppConfig;