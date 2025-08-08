import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Save, X } from "lucide-react";
import { AppConfig } from "@/hooks/useAppConfig";

interface EditAppDialogProps {
  app: AppConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Omit<AppConfig, "id">>) => void;
  onDelete: (id: string) => void;
}

const EditAppDialog = ({ app, open, onOpenChange, onSave, onDelete }: EditAppDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    accentColor: "",
    icon: "",
    networkCheckEnabled: true,
    specification: {
      category: "",
      vendor: "",
      type: "Web Application",
      protocol: "HTTPS"
    }
  });

useEffect(() => {
  if (app) {
    setFormData({
      name: app.name,
      description: app.description,
      url: app.url,
      accentColor: app.accentColor,
      icon: app.icon,
      networkCheckEnabled: app.networkCheckEnabled ?? true,
      specification: {
        category: app.specification?.category || "",
        vendor: app.specification?.vendor || "",
        type: app.specification?.type || "Web Application",
        protocol: app.specification?.protocol || "HTTPS"
      }
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

<div className="flex items-center justify-between rounded-md border border-border p-3">
  <div>
    <Label>Connectivity check</Label>
    <p className="text-xs text-muted-foreground">Show online/offline for this app</p>
  </div>
  <Switch
    checked={formData.networkCheckEnabled}
    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, networkCheckEnabled: checked }))}
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

          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground">App Specification</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.specification.category}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specification: { ...prev.specification, category: e.target.value }
                  }))}
                  placeholder="e.g., Network Management"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={formData.specification.vendor}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specification: { ...prev.specification, vendor: e.target.value }
                  }))}
                  placeholder="e.g., Ubiquiti"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.specification.type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specification: { ...prev.specification, type: e.target.value }
                  }))}
                  placeholder="e.g., Web Application"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Input
                  id="protocol"
                  value={formData.specification.protocol}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specification: { ...prev.specification, protocol: e.target.value }
                  }))}
                  placeholder="e.g., HTTPS"
                />
              </div>
            </div>
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