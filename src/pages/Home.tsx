import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import sofaRomeo from "@/assets/sofa-romeo.jpg";
import sofaRixsos from "@/assets/sofa-rixsos.jpg";
import sofaRomance from "@/assets/sofa-romance.jpg";
import sofaNevada from "@/assets/sofa-nevada.jpg";

const Home = () => {
  const featuredProducts = [
    { name: "Romeo", image: sofaRomeo, model: "romeo" },
    { name: "Rixsos", image: sofaRixsos, model: "rixsos" },
    { name: "Romance", image: sofaRomance, model: "romance" },
    { name: "Nevada", image: sofaNevada, model: "nevada" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/80" />
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
            Timeless Elegance
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover handcrafted furniture that transforms your space into a sanctuary of comfort and style
          </p>
          <Link to="/products">
            <Button size="lg" className="group">
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-foreground/30 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our signature pieces, each designed with meticulous attention to detail and crafted for lasting beauty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.model}
                to={`/products/${product.model}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl bg-card shadow-soft hover:shadow-medium transition-all duration-500 transform hover:-translate-y-2">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground flex items-center group-hover:text-primary transition-colors">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Crafted with Passion
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            For over two decades, we've been creating furniture that tells a story. Each piece is a testament to our commitment to quality, sustainability, and timeless design. We believe that furniture should be more than functional—it should inspire, comfort, and elevate your everyday life.
          </p>
          <Link to="/about">
            <Button variant="outline">Learn More About Us</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;