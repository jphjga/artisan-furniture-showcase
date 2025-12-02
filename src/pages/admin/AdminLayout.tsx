import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Info, 
  Phone, 
  LogOut, 
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Products", path: "/admin/products", icon: Package },
  { title: "About Us", path: "/admin/about", icon: Info },
  { title: "Contact", path: "/admin/contact", icon: Phone },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate("/admin");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/admin");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 lg:w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {sidebarOpen && (
              <span className="font-display text-xl font-bold text-primary">
                Admin Panel
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:flex hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    !sidebarOpen && "lg:justify-center lg:px-2"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                  {sidebarOpen && <span>{item.title}</span>}
                </Button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
                !sidebarOpen && "lg:justify-center lg:px-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-card border-b flex items-center px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mr-4"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-xl font-semibold text-foreground">
            {navItems.find((item) => item.path === location.pathname)?.title || "Dashboard"}
          </h1>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
