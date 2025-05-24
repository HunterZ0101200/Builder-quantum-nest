import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  products as allProducts,
  getProductsByCategory,
  categories,
} from "@/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

const Products = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    let filteredProducts = categoryId
      ? getProductsByCategory(categoryId)
      : allProducts;

    // Apply search filter
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    setProducts(filteredProducts);
  }, [categoryId, searchTerm, priceRange]);

  const currentCategory = categoryId
    ? categories.find((cat) => cat.id === categoryId)
    : null;

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 500]);
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {currentCategory ? currentCategory.name : "All Products"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          available
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filters Toggle */}
        <Button
          variant="outline"
          className="flex items-center md:hidden mb-4"
          onClick={toggleFilters}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {filtersVisible ? "Hide Filters" : "Show Filters"}
        </Button>

        {/* Filters Sidebar */}
        <div
          className={`${filtersVisible ? "block" : "hidden"} md:block w-full md:w-64 space-y-6`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Search</h4>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={categoryId === category.id}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
};

export default Products;
