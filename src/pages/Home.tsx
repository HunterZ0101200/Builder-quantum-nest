import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getFeaturedProducts } from "@/data/products";
import { categories } from "@/data/products";

const Home = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-lg">
        <div className="bg-gradient-to-r from-primary to-primary/80 py-16 px-8 md:py-24 md:px-12">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Summer Collection 2023
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Discover our latest products with premium quality and affordable
              prices. Shop now and get free shipping on all orders.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <Link
            to="/products"
            className="flex items-center text-sm font-medium text-primary hover:underline"
          >
            View all categories
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products/${category.id}`}
              className="relative overflow-hidden rounded-lg group"
            >
              <div className="aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                  <h3 className="text-xl font-medium text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="flex items-center text-sm font-medium text-primary hover:underline"
          >
            View all products
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* Promotion Banner */}
      <section className="mt-16">
        <div className="bg-secondary rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Get 15% Off Your First Order
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sign up for our newsletter and receive a discount code.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="#">Subscribe Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
