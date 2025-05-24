import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Filter, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products as allProducts } from "@/data/products";
import { Product } from "@/types";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Filter products based on search query
  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }

    const filteredProducts = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase());

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesPrice;
    });

    setProducts(filteredProducts);
  }, [query, priceRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="mb-8">
        <Link
          to="/search"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Link>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10 pr-24"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </form>

        <h1 className="text-2xl font-bold tracking-tight">
          {query ? `Search results for "${query}"` : "Search Results"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"}{" "}
          found
        </p>
      </div>

      {products.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filters Toggle */}
          <Button
            variant="outline"
            className="flex items-center md:hidden mb-4"
            onClick={toggleFilters}
          >
            <Filter className="w-4 h-4 mr-2" />
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
                  onClick={() => setPriceRange([0, 500])}
                >
                  Clear all
                </Button>
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
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid products={products} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <SearchIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            Try using different keywords or browse our categories
          </p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
