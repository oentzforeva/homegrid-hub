import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, X } from "lucide-react";
import { App } from "@/hooks/useAppsData";

interface AddAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (app: Omit<App, "id">) => void;
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
    icon: ""
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
      icon: formData.icon.trim() || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop&crop=center`
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      url: "",
      accentColor: predefinedColors[0],
      icon: ""
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