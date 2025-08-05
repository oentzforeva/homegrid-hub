import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Save, X } from "lucide-react";
import { App } from "@/hooks/useAppsData";

interface EditAppDialogProps {
  app: App | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Omit<App, "id">>) => void;
  onDelete: (id: string) => void;
}

const EditAppDialog = ({ app, open, onOpenChange, onSave, onDelete }: EditAppDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    accentColor: "",
    icon: ""
  });

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name,
        description: app.description,
        url: app.url,
        accentColor: app.accentColor,
        icon: app.icon
      });
    }
  }, [app]);

  const handleSave = () => {
    if (!app) return;
    
    onSave(app.id, formData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!app) return;
    
    if (confirm(`Are you sure you want to delete "${app.name}"?`)) {
      onDelete(app.id);
      onOpenChange(false);
    }
  };

  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src={app.icon} alt="" className="w-6 h-6 rounded" />
            Edit {app.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">App Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter app name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter app description"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color (HSL)</Label>
            <Input
              id="accentColor"
              value={formData.accentColor}
              onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
              placeholder="hsl(217, 91%, 60%)"
            />
            <div 
              className="w-full h-8 rounded border border-border"
              style={{ backgroundColor: formData.accentColor }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon URL</Label>
            <Input
              id="icon"
              type="url"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="https://example.com/icon.png"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppDialog;