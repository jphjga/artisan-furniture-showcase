import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ProductDetail = () => {
  const { model } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", model],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("model", model)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleWhatsAppOrder = () => {
    if (!product) return;
    
    const message = encodeURIComponent(
      `Hi! I'm interested in ordering the ${product.name} (Model: ${product.model})`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Product not found</h2>
          <Link to="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const dimensions = product.dimensions as { width?: string; height?: string; depth?: string };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="container mx-auto">
        <Link
          to="/products"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted shadow-medium">
              {product.images && product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-primary shadow-medium"
                        : "ring-1 ring-border hover:ring-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3">Available Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <span
                      key={color}
                      className="px-4 py-2 bg-muted rounded-full text-sm capitalize"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensions */}
            {dimensions && (dimensions.width || dimensions.height || dimensions.depth) && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3">Dimensions</h3>
                <div className="grid grid-cols-3 gap-4">
                  {dimensions.width && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Width</p>
                      <p className="font-semibold">{dimensions.width}</p>
                    </div>
                  )}
                  {dimensions.height && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Height</p>
                      <p className="font-semibold">{dimensions.height}</p>
                    </div>
                  )}
                  {dimensions.depth && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Depth</p>
                      <p className="font-semibold">{dimensions.depth}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WhatsApp Order Button */}
            <Button
              size="lg"
              onClick={handleWhatsAppOrder}
              className="w-full group"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Order via WhatsApp
            </Button>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              Contact us directly to discuss customization options and delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;