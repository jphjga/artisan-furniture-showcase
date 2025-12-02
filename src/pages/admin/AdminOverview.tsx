import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, FileText, Phone, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminOverview = () => {
  const navigate = useNavigate();

  const { data: productCount, isLoading: loadingProducts } = useQuery({
    queryKey: ["product-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const stats = [
    {
      label: "Total Products",
      value: loadingProducts ? "..." : productCount,
      icon: Package,
      color: "bg-primary/10 text-primary",
      path: "/admin/products",
    },
    {
      label: "About Sections",
      value: 5,
      icon: FileText,
      color: "bg-accent/10 text-accent",
      path: "/admin/about",
    },
    {
      label: "Contact Info",
      value: "Configured",
      icon: Phone,
      color: "bg-green-500/10 text-green-600",
      path: "/admin/contact",
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Welcome to your admin dashboard. Manage your website content from here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => navigate(stat.path)}
            className="bg-card rounded-xl border p-6 text-left hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/products/new")}
            className="p-4 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <Package className="h-5 w-5 text-primary mb-2" />
            <p className="font-medium text-foreground">Add New Product</p>
            <p className="text-sm text-muted-foreground">Create a new furniture listing</p>
          </button>
          <button
            onClick={() => navigate("/admin/about")}
            className="p-4 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <FileText className="h-5 w-5 text-primary mb-2" />
            <p className="font-medium text-foreground">Edit About Us</p>
            <p className="text-sm text-muted-foreground">Update company information</p>
          </button>
          <button
            onClick={() => navigate("/admin/contact")}
            className="p-4 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            <Phone className="h-5 w-5 text-primary mb-2" />
            <p className="font-medium text-foreground">Update Contact</p>
            <p className="text-sm text-muted-foreground">Manage contact details</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
