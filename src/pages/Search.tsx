import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/products";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container px-4 py-12 mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">Search Products</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="What are you looking for?"
            className="pl-10 pr-4 h-14 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10"
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </div>
      </form>

      {/* Popular Categories */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate(`/products/${category.id}`)}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Headphones",
            "Smart Watch",
            "Leather Wallet",
            "Backpack",
            "T-Shirt",
            "Coffee Mug",
          ].map((term) => (
            <Button
              key={term}
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                setSearchQuery(term);
                navigate(`/search-results?q=${encodeURIComponent(term)}`);
              }}
            >
              {term}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
