import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, X } from "lucide-react";
import { AppConfig } from "@/hooks/useAppConfig";

interface AddAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (app: Omit<AppConfig, "id">) => void;
}

const predefinedColors = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(199, 89%, 48%)", // Light Blue
  "hsl(25, 95%, 53%)",  // Orange
  "hsl(45, 93%, 58%)",  // Yellow
  "hsl(142, 76%, 36%)", // Green
  "hsl(291, 64%, 42%)", // Purple
  "hsl(348, 83%, 47%)", // Red
  "hsl(173, 58%, 39%)", // Teal
];

const AddAppDialog = ({ open, onOpenChange, onAdd }: AddAppDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    accentColor: predefinedColors[0],
    icon: "",
    networkCheckEnabled: true,
    specification: {
      category: "",
      vendor: "",
      type: "Web Application",
      protocol: "HTTPS"
    }
  });

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      alert("Please fill in at least the app name and URL");
      return;
    }

onAdd({
  name: formData.name.trim(),
  description: formData.description.trim(),
  url: formData.url.trim(),
  accentColor: formData.accentColor,
  icon: formData.icon.trim() || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop&crop=center`,
  networkCheckEnabled: formData.networkCheckEnabled,
  specification: {
    category: formData.specification.category.trim() || "Custom Application",
    vendor: formData.specification.vendor.trim() || "Unknown",
    type: formData.specification.type,
    protocol: formData.specification.protocol
  }
});

// Reset form
setFormData({
  name: "",
  description: "",
  url: "",
  accentColor: predefinedColors[0],
  icon: "",
  networkCheckEnabled: true,
  specification: {
    category: "",
    vendor: "",
    type: "Web Application",
    protocol: "HTTPS"
  }
});
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New App
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="add-name">App Name *</Label>
            <Input
              id="add-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter app name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-description">Description</Label>
            <Textarea
              id="add-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter app description"
              rows={2}
            />
          </div>

<div className="space-y-2">
  <Label htmlFor="add-url">URL *</Label>
  <Input
    id="add-url"
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
            <Label>Accent Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-full h-8 rounded border-2 transition-all ${
                    formData.accentColor === color 
                      ? 'border-primary scale-105' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, accentColor: color }))}
                />
              ))}
            </div>
            <Input
              value={formData.accentColor}
              onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
              placeholder="hsl(217, 91%, 60%)"
              className="text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-icon">Icon URL (optional)</Label>
            <Input
              id="add-icon"
              type="url"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="https://example.com/icon.png"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use a default circuit board icon
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground">App Specification</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="add-category">Category</Label>
                <Input
                  id="add-category"
                  value={formData.specification.category}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specification: { ...prev.specification, category: e.target.value }
                  }))}
                  placeholder="e.g., Network Management"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-vendor">Vendor</Label>
                <Input
                  id="add-vendor"
                  value={formData.specification.vendor}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specification: { ...prev.specification, vendor: e.target.value }
                  }))}
                  placeholder="e.g., Ubiquiti"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-type">Type</Label>
                <Input
                  id="add-type"
                  value={formData.specification.type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    specification: { ...prev.specification, type: e.target.value }
                  }))}
                  placeholder="e.g., Web Application"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-protocol">Protocol</Label>
                <Input
                  id="add-protocol"
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

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Add App
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppDialog;