import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteProductId);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "The product has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteProductId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage your furniture products catalog
        </p>
        <Button onClick={() => navigate("/admin/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products && products.length > 0 ? (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg border p-4 flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {product.description}
                </p>
                <div className="flex gap-2 mt-1">
                  {product.featured && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setDeleteProductId(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border">
          <p className="text-muted-foreground mb-4">No products yet</p>
          <Button onClick={() => navigate("/admin/products/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
