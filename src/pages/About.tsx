const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground">
            Crafting timeless furniture for over 20 years
          </p>
        </div>

        <div className="space-y-12 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <section>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Who We Are
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              FurnitureCo is a family-owned business dedicated to creating exceptional furniture that combines traditional craftsmanship with contemporary design. Founded in 2003, we've grown from a small workshop to a renowned furniture manufacturer, always staying true to our core values of quality, sustainability, and customer satisfaction.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Our Craftsmanship
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Every piece of furniture we create is a labor of love. Our skilled artisans use time-honored techniques combined with modern innovation to ensure each item meets our exacting standards. We source sustainable materials and work with local suppliers whenever possible, reducing our environmental impact while supporting our community.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From the initial design sketch to the final finishing touches, we pour our passion into every detail. We believe that furniture should not only look beautiful but also stand the test of time, becoming cherished pieces that can be passed down through generations.
            </p>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Our Commitment
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-muted/50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2 text-primary">Quality</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality, using only the finest materials and construction methods.
                </p>
              </div>
              <div className="bg-muted/50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2 text-primary">Sustainability</h3>
                <p className="text-muted-foreground">
                  Environmental responsibility guides our choices, from sourcing to production.
                </p>
              </div>
              <div className="bg-muted/50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2 text-primary">Service</h3>
                <p className="text-muted-foreground">
                  Customer satisfaction is at the heart of everything we do, from consultation to delivery.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Visit Our Showroom
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We invite you to visit our showroom to experience our furniture in person. Our knowledgeable team is always ready to help you find the perfect pieces for your home and discuss customization options. Contact us to schedule an appointment or simply drop by during our business hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;