import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

interface SiteContent {
  id: string;
  section: string;
  title: string | null;
  content: string | null;
}

const AdminAbout = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, { title: string; content: string }>>({});

  const { data: content, isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("created_at");
      
      if (error) throw error;
      return data as SiteContent[];
    },
  });

  useEffect(() => {
    if (content) {
      const initialData: Record<string, { title: string; content: string }> = {};
      content.forEach((item) => {
        initialData[item.section] = {
          title: item.title || "",
          content: item.content || "",
        };
      });
      setFormData(initialData);
    }
  }, [content]);

  const handleChange = (section: string, field: "title" | "content", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      for (const [section, data] of Object.entries(formData)) {
        const { error } = await supabase
          .from("site_content")
          .update({ title: data.title, content: data.content })
          .eq("section", section);

        if (error) throw error;
      }

      toast({
        title: "Content saved",
        description: "About Us content has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sections = [
    { key: "hero", label: "Hero Section", showContent: true },
    { key: "about_intro", label: "Introduction", showContent: true },
    { key: "about_mission", label: "Our Mission", showContent: true },
    { key: "about_vision", label: "Our Vision", showContent: true },
    { key: "about_values", label: "Our Values", showContent: true },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Update the About Us page content
        </p>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.key} className="bg-card rounded-lg border p-6 space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              {section.label}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor={`${section.key}-title`}>Title</Label>
                <Input
                  id={`${section.key}-title`}
                  value={formData[section.key]?.title || ""}
                  onChange={(e) => handleChange(section.key, "title", e.target.value)}
                  placeholder="Enter title"
                  className="mt-2"
                />
              </div>

              {section.showContent && (
                <div>
                  <Label htmlFor={`${section.key}-content`}>Content</Label>
                  <Textarea
                    id={`${section.key}-content`}
                    value={formData[section.key]?.content || ""}
                    onChange={(e) => handleChange(section.key, "content", e.target.value)}
                    placeholder="Enter content"
                    className="mt-2 min-h-[100px]"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAbout;
