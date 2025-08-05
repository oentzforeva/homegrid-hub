import { useState } from "react";
import { Server, Activity, Edit, Plus, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AppCard from "./AppCard";
import EditAppDialog from "./EditAppDialog";
import AddAppDialog from "./AddAppDialog";
import { useAppsData, App } from "@/hooks/useAppsData";

const NetworkDashboard = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { apps, addApp, updateApp, deleteApp, resetToDefaults } = useAppsData();
  const { toast } = useToast();

  const handleAppClick = (app: App) => {
    if (isEditMode) return;
    
    // Open the app URL directly
    handleAppLaunch(app.url);
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
  };

  const handleResetApps = () => {
    if (confirm("Reset all apps to defaults? This will remove any custom apps you've added.")) {
      resetToDefaults();
      toast({
        title: "Apps reset",
        description: "Dashboard reset to default apps",
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
                <h1 className="text-3xl font-bold text-foreground">
                  Network Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Home Network Services
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent animate-pulse" />
                  <span>Online</span>
                </div>
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
                      Reset
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

          {/* Status indicators */}
          {isEditMode && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg">
              <Edit className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">
                Edit Mode - Click apps to modify, hover for actions
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
                url={app.url}
                isEditMode={isEditMode}
                onClick={() => handleAppClick(app)}
                onEdit={() => handleEditApp(app)}
                onLaunch={() => handleAppLaunch(app.url)}
              />
            ))}
          </div>

          {/* Footer info */}
          <footer className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              {isEditMode 
                ? "Edit mode: Click apps to modify • Hover for action buttons" 
                : "Click apps to launch • Click Edit to customize apps"
              }
            </p>
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