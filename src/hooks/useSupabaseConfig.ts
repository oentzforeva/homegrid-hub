import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AppConfig, DashboardConfig, defaultDashboardConfig } from '@/config/appConfig';
import { defaultApps } from '@/config/defaultApps';

const TABLE_APPS = 'dashboard_apps';
const TABLE_SETTINGS = 'dashboard_settings';

export const useSupabaseConfig = () => {
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(defaultDashboardConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Load configuration from Supabase
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      // Load apps
      const { data: appsData, error: appsError } = await supabase
        .from(TABLE_APPS)
        .select('*')
        .order('created_at', { ascending: true });

      if (appsError) {
        console.log('No apps table found, using defaults');
        setApps(defaultApps);
      } else if (appsData && appsData.length > 0) {
        setApps(appsData.map(row => row.config));
      } else {
        // First time - save defaults to Supabase
        await saveAppsToSupabase(defaultApps);
        setApps(defaultApps);
      }

      // Load dashboard settings
      const { data: settingsData, error: settingsError } = await supabase
        .from(TABLE_SETTINGS)
        .select('*')
        .single();

      if (settingsError) {
        console.log('No settings found, using defaults');
        setDashboardConfig(defaultDashboardConfig);
        await saveDashboardToSupabase(defaultDashboardConfig);
      } else {
        setDashboardConfig(settingsData.config);
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      setApps(defaultApps);
      setDashboardConfig(defaultDashboardConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAppsToSupabase = async (appsToSave: AppConfig[]) => {
    try {
      // Clear existing apps
      await supabase.from(TABLE_APPS).delete().neq('id', '');
      
      // Insert new apps
      const appsWithId = appsToSave.map((app, index) => ({
        id: app.id,
        config: app,
        sort_order: index
      }));

      const { error } = await supabase.from(TABLE_APPS).insert(appsWithId);
      if (error) throw error;
    } catch (error) {
      console.error('Error saving apps to Supabase:', error);
    }
  };

  const saveDashboardToSupabase = async (config: DashboardConfig) => {
    try {
      const { error } = await supabase
        .from(TABLE_SETTINGS)
        .upsert({ 
          id: 'dashboard',
          config,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving dashboard to Supabase:', error);
    }
  };

  const addApp = async (appData: Omit<AppConfig, "id" | "lastModified" | "isCustom">) => {
    const newApp: AppConfig = {
      ...appData,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastModified: new Date().toISOString(),
      isCustom: true
    };
    
    const updatedApps = [...apps, newApp];
    setApps(updatedApps);
    await saveAppsToSupabase(updatedApps);
    return newApp.id;
  };

  const updateApp = async (id: string, updates: Partial<Omit<AppConfig, "id">>) => {
    const updatedApps = apps.map(app => 
      app.id === id 
        ? { 
            ...app, 
            ...updates, 
            lastModified: new Date().toISOString()
          } 
        : app
    );
    setApps(updatedApps);
    await saveAppsToSupabase(updatedApps);
  };

  const deleteApp = async (id: string) => {
    const updatedApps = apps.filter(app => app.id !== id);
    setApps(updatedApps);
    await saveAppsToSupabase(updatedApps);
  };

  const updateDashboardConfig = async (updates: Partial<DashboardConfig>) => {
    const updatedConfig = {
      ...dashboardConfig,
      ...updates,
      metadata: {
        ...dashboardConfig.metadata,
        lastModified: new Date().toISOString()
      }
    };
    setDashboardConfig(updatedConfig);
    await saveDashboardToSupabase(updatedConfig);
  };

  return {
    apps,
    dashboardConfig,
    isLoading,
    addApp,
    updateApp,
    deleteApp,
    updateDashboardConfig,
    getAppById: (id: string) => apps.find(app => app.id === id),
    getAppsByCategory: (category: string) => apps.filter(app => app.specification.category === category),
    getCategories: () => Array.from(new Set(apps.map(app => app.specification.category))),
  };
};

export { type AppConfig };