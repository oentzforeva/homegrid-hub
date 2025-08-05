import { useState, useEffect } from "react";
import { Server, Activity, Edit, Plus, RotateCcw, Save, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import AppCard from "./AppCard";
import EditAppDialog from "./EditAppDialog";
import AddAppDialog from "./AddAppDialog";
import { useAppsData, App } from "@/hooks/useAppsData";

const DASHBOARD_SETTINGS_KEY = "network-dashboard-settings";

const defaultSettings = {
  title: "Network Dashboard",
  subtitle: "Home Network Services", 
  footer: "Click apps to launch • Click Edit to customize dashboard",
  networkStatusEnabled: true
};

const NetworkDashboard = () => {
  console.log("NetworkDashboard component is rendering");
  console.log("Starting component initialization...");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Network status state
  const [isOnline, setIsOnline] = useState(true);
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null);
  const [appStatuses, setAppStatuses] = useState<Record<string, boolean>>({});
  
  // Dashboard settings state
  const [dashboardSettings, setDashboardSettings] = useState(defaultSettings);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [isEditingFooter, setIsEditingFooter] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempSubtitle, setTempSubtitle] = useState("");
  const [tempFooter, setTempFooter] = useState("");
  
  const { apps, addApp, updateApp, deleteApp, resetToDefaults } = useAppsData();
  const { toast } = useToast();

  // Network connectivity check function
  const checkConnectivity = async () => {
    if (!dashboardSettings.networkStatusEnabled) return;
    
    try {
      // Use a reliable endpoint as a proxy for network connectivity
      // We'll use Google's DNS-over-HTTPS API as it's fast and reliable
      const response = await fetch('https://dns.google/resolve?name=google.com&type=A', {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (response.ok) {
        setIsOnline(true);
        setLastPingTime(new Date());
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      setIsOnline(false);
      console.warn('Network connectivity check failed:', error);
    }
  };

  // Check individual app connectivity
  const checkAppConnectivity = async (app: App) => {
    if (!app.url || !dashboardSettings.networkStatusEnabled) return;
    
    try {
      // Extract hostname from URL for DNS checking
      const url = new URL(app.url);
      const hostname = url.hostname;
      
      // Use DNS lookup as a proxy for connectivity
      const response = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Check if DNS resolution was successful
        setAppStatuses(prev => ({ 
          ...prev, 
          [app.id]: data.Status === 0 && data.Answer && data.Answer.length > 0 
        }));
      } else {
        setAppStatuses(prev => ({ ...prev, [app.id]: false }));
      }
    } catch (error) {
      setAppStatuses(prev => ({ ...prev, [app.id]: false }));
      console.warn(`App connectivity check failed for ${app.name}:`, error);
    }
  };

  // Check all apps connectivity
  const checkAllAppsConnectivity = async () => {
    if (!dashboardSettings.networkStatusEnabled) return;
    
    const appsWithUrls = apps.filter(app => app.url);
    await Promise.all(appsWithUrls.map(checkAppConnectivity));
  };

  // Set up periodic connectivity checking (every 5 minutes)
  useEffect(() => {
    if (!dashboardSettings.networkStatusEnabled) return;
    
    // Initial check
    checkConnectivity();
    checkAllAppsConnectivity();
    
    // Set up interval for every 5 minutes (300,000ms)
    const interval = setInterval(() => {
      checkConnectivity();
      checkAllAppsConnectivity();
    }, 5 * 60 * 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [apps, dashboardSettings.networkStatusEnabled]); // Re-run when apps change or network status setting changes

  // Load dashboard settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DASHBOARD_SETTINGS_KEY);
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        // Ensure networkStatusEnabled has a default value for backwards compatibility
        setDashboardSettings({
          ...defaultSettings,
          ...parsedSettings,
          networkStatusEnabled: parsedSettings.networkStatusEnabled ?? true
        });
      } catch (error) {
        console.error("Failed to parse dashboard settings:", error);
      }
    }
  }, []);

  // Save dashboard settings to localStorage
  useEffect(() => {
    localStorage.setItem(DASHBOARD_SETTINGS_KEY, JSON.stringify(dashboardSettings));
  }, [dashboardSettings]);

  const handleNetworkStatusToggle = (enabled: boolean) => {
    setDashboardSettings(prev => ({ ...prev, networkStatusEnabled: enabled }));
    
    if (!enabled) {
      // Clear network status when disabled
      setAppStatuses({});
      setIsOnline(true);
      setLastPingTime(null);
    }
    
    toast({
      title: enabled ? "Network status enabled" : "Network status disabled",
      description: enabled 
        ? "Network connectivity checking is now active"
        : "Network connectivity checking has been turned off",
    });
  };

  const handleAppClick = (app: App) => {
    if (isEditMode) return;
    
    // Open the app URL directly
    handleAppLaunch(app.url);
  };

  const handleStartEditTitle = () => {
    setTempTitle(dashboardSettings.title);
    setIsEditingTitle(true);
  };

  const handleStartEditSubtitle = () => {
    setTempSubtitle(dashboardSettings.subtitle);
    setIsEditingSubtitle(true);
  };

  const handleStartEditFooter = () => {
    setTempFooter(dashboardSettings.footer);
    setIsEditingFooter(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setDashboardSettings(prev => ({ ...prev, title: tempTitle.trim() }));
      toast({
        title: "Title updated",
        description: "Dashboard title saved successfully",
      });
    }
    setIsEditingTitle(false);
  };

  const handleSaveSubtitle = () => {
    if (tempSubtitle.trim()) {
      setDashboardSettings(prev => ({ ...prev, subtitle: tempSubtitle.trim() }));
      toast({
        title: "Subtitle updated", 
        description: "Dashboard subtitle saved successfully",
      });
    }
    setIsEditingSubtitle(false);
  };

  const handleSaveFooter = () => {
    if (tempFooter.trim()) {
      setDashboardSettings(prev => ({ ...prev, footer: tempFooter.trim() }));
      toast({
        title: "Footer updated",
        description: "Dashboard footer saved successfully", 
      });
    }
    setIsEditingFooter(false);
  };

  const handleCancelTitleEdit = () => {
    setIsEditingTitle(false);
    setTempTitle("");
  };

  const handleCancelSubtitleEdit = () => {
    setIsEditingSubtitle(false);
    setTempSubtitle("");
  };

  const handleCancelFooterEdit = () => {
    setIsEditingFooter(false);
    setTempFooter("");
  };

  const handleAppLaunch = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    toast({
      title: "Launching app",
      description: "Opening in new tab...",
    });
  };

  const handleEditApp = (app: App) => {
    setEditingApp(app);
  };

  const handleSaveApp = (id: string, updates: Partial<Omit<App, "id">>) => {
    updateApp(id, updates);
    toast({
      title: "App updated",
      description: "Changes saved successfully",
    });
  };

  const handleDeleteApp = (id: string) => {
    deleteApp(id);
    toast({
      title: "App deleted",
      description: "App removed from dashboard",
    });
  };

  const handleAddApp = (newApp: Omit<App, "id">) => {
    addApp(newApp);
    toast({
      title: "App added",
      description: `${newApp.name} added to dashboard`,
    });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // Cancel any ongoing title/subtitle/footer edits when toggling mode
    setIsEditingTitle(false);
    setIsEditingSubtitle(false);
    setIsEditingFooter(false);
  };

  const handleResetApps = () => {
    if (confirm("Reset dashboard to defaults? This will remove custom apps and reset title/subtitle.")) {
      resetToDefaults();
      setDashboardSettings(defaultSettings);
      toast({
        title: "Dashboard reset",
        description: "Dashboard reset to defaults",
      });
    }
  };

  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  console.log("About to render NetworkDashboard JSX");
  
  return (
    <div className="min-h-screen bg-background">
      <h1>Test - Dashboard Loading</h1>
      <p>If you can see this, the component is working</p>
    </div>
  );
};

export default NetworkDashboard;
