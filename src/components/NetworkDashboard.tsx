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

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-6 py-8">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-card rounded-xl border border-border shadow-card">
                <Server className="h-8 w-8 text-primary" />
              </div>
              <div>
                {/* Editable Title */}
                {isEditMode && isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="text-3xl font-bold bg-transparent border-primary/50 focus:border-primary"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') handleCancelTitleEdit();
                      }}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveTitle}>
                      <Check className="h-4 w-4 text-accent" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelTitleEdit}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <h1 
                    className={cn(
                      "text-3xl font-bold text-foreground",
                      isEditMode && "cursor-pointer hover:text-primary transition-colors"
                    )}
                    onClick={isEditMode ? handleStartEditTitle : undefined}
                  >
                    {dashboardSettings.title}
                    {isEditMode && (
                      <Edit className="inline ml-2 h-5 w-5 text-muted-foreground" />
                    )}
                  </h1>
                )}

                {/* Editable Subtitle */}
                {isEditMode && isEditingSubtitle ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={tempSubtitle}
                      onChange={(e) => setTempSubtitle(e.target.value)}
                      className="text-base bg-transparent border-primary/50 focus:border-primary"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveSubtitle();
                        if (e.key === 'Escape') handleCancelSubtitleEdit();
                      }}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={handleSaveSubtitle}>
                      <Check className="h-4 w-4 text-accent" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelSubtitleEdit}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <p 
                    className={cn(
                      "text-muted-foreground",
                      isEditMode && "cursor-pointer hover:text-primary transition-colors"
                    )}
                    onClick={isEditMode ? handleStartEditSubtitle : undefined}
                  >
                    {dashboardSettings.subtitle}
                    {isEditMode && (
                      <Edit className="inline ml-2 h-4 w-4 text-muted-foreground" />
                    )}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {dashboardSettings.networkStatusEnabled && (
                  <div className="flex items-center gap-2">
                    <Activity 
                      className={cn(
                        "h-4 w-4", 
                        isOnline 
                          ? "text-green-500 animate-pulse" 
                          : "text-red-500 animate-[blink_1s_linear_infinite]"
                      )} 
                    />
                    <span className={isOnline ? "text-green-500" : "text-red-500"}>
                      {isOnline ? "Online" : "Offline"}
                    </span>
                    {lastPingTime && isOnline && (
                      <span className="text-xs text-muted-foreground/70">
                        • Last check: {lastPingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                )}
                <div className="font-mono">
                  {currentTime}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add App
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetApps}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset All
                    </Button>
                  </>
                )}
                <Button
                  variant={isEditMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleEditMode}
                  className="flex items-center gap-2"
                >
                  {isEditMode ? (
                    <>
                      <Save className="h-4 w-4" />
                      Done
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Status indicators and settings */}
          {isEditMode && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg">
                <Edit className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-medium">
                  Edit Mode - Click apps to modify • Click title/subtitle to edit
                </span>
              </div>
              
              {/* Network Status Toggle */}
              <div className="inline-flex items-center gap-4 px-4 py-3 bg-gradient-card border border-border rounded-lg">
                <Label htmlFor="network-status-toggle" className="text-sm font-medium">
                  Network Status Monitoring
                </Label>
                <Switch
                  id="network-status-toggle"
                  checked={dashboardSettings.networkStatusEnabled}
                  onCheckedChange={handleNetworkStatusToggle}
                />
                <span className="text-xs text-muted-foreground">
                  {dashboardSettings.networkStatusEnabled 
                    ? "Checks connectivity every 5 minutes" 
                    : "Network monitoring disabled"
                  }
                </span>
              </div>
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
                url={app.url}
                isEditMode={isEditMode}
                isOnline={dashboardSettings.networkStatusEnabled ? appStatuses[app.id] : undefined}
                onClick={() => handleAppClick(app)}
                onEdit={() => handleEditApp(app)}
                onLaunch={() => handleAppLaunch(app.url)}
              />
            ))}
          </div>

          {/* Footer info */}
          <footer className="mt-16 text-center">
            {/* Editable Footer */}
            {isEditMode && isEditingFooter ? (
              <div className="flex items-center justify-center gap-2">
                <Input
                  value={tempFooter}
                  onChange={(e) => setTempFooter(e.target.value)}
                  className="text-sm bg-transparent border-primary/50 focus:border-primary max-w-md"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveFooter();
                    if (e.key === 'Escape') handleCancelFooterEdit();
                  }}
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleSaveFooter}>
                  <Check className="h-4 w-4 text-accent" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelFooterEdit}>
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <p 
                className={cn(
                  "text-sm text-muted-foreground",
                  isEditMode && "cursor-pointer hover:text-primary transition-colors"
                )}
                onClick={isEditMode ? handleStartEditFooter : undefined}
              >
                {isEditMode 
                  ? "Edit mode: Click apps to modify • Click title/subtitle/footer to customize • Use Reset All to restore defaults"
                  : dashboardSettings.footer
                }
                {isEditMode && (
                  <Edit className="inline ml-2 h-4 w-4 text-muted-foreground" />
                )}
              </p>
            )}
          </footer>
        </main>

        {/* Dialogs */}
        <EditAppDialog
          app={editingApp}
          open={!!editingApp}
          onOpenChange={(open) => !open && setEditingApp(null)}
          onSave={handleSaveApp}
          onDelete={handleDeleteApp}
        />
        
        <AddAppDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={handleAddApp}
        />
      </div>
    </div>
  );
};

export default NetworkDashboard;
