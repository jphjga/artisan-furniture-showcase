import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    description: "",
    category: "sofa",
    featured: false,
    width: "",
    height: "",
    depth: "",
  });
  const [colors, setColors] = useState<string[]>([""]);
  const [images, setImages] = useState<string[]>([""]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const dimensions = data.dimensions as { width?: string; height?: string; depth?: string };

      setFormData({
        name: data.name,
        model: data.model,
        description: data.description,
        category: data.category,
        featured: data.featured,
        width: dimensions.width || "",
        height: dimensions.height || "",
        depth: dimensions.depth || "",
      });
      setColors(data.colors.length > 0 ? data.colors : [""]);
      setImages(data.images.length > 0 ? data.images : [""]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        name: formData.name,
        model: formData.model,
        description: formData.description,
        category: formData.category,
        featured: formData.featured,
        colors: colors.filter(c => c.trim() !== ""),
        images: images.filter(img => img.trim() !== ""),
        dimensions: {
          width: formData.width,
          height: formData.height,
          depth: formData.depth,
        },
      };

      if (id) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", id);

        if (error) throw error;
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
        toast({ title: "Success", description: "Product created successfully" });
      }

      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">
          {id ? "Edit Product" : "Add New Product"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Romeo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                placeholder="e.g., romeo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              placeholder="Describe the furniture piece..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Colors</label>
            {colors.map((color, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[index] = e.target.value;
                    setColors(newColors);
                  }}
                  placeholder="e.g., Beige, Brown"
                />
                {colors.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setColors(colors.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setColors([...colors, ""])}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URLs</label>
            {images.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={image}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = e.target.value;
                    setImages(newImages);
                  }}
                  placeholder="https://example.com/image.jpg"
                />
                {images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImages([...images, ""])}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Width</label>
              <Input
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                placeholder="e.g., 200cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height</label>
              <Input
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="e.g., 85cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Depth</label>
              <Input
                value={formData.depth}
                onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                placeholder="e.g., 90cm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
            <label className="text-sm font-medium">Featured Product</label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                id ? "Update Product" : "Create Product"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/dashboard")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;