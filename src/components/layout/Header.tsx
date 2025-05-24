import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Header = () => {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const goToSearchPage = () => {
    navigate("/search");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ShopFusion</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium hover:text-primary"
          >
            All Products
          </Link>
          <Link
            to="/products/electronics"
            className="text-sm font-medium hover:text-primary"
          >
            Electronics
          </Link>
          <Link
            to="/products/clothing"
            className="text-sm font-medium hover:text-primary"
          >
            Clothing
          </Link>
          <Link
            to="/products/accessories"
            className="text-sm font-medium hover:text-primary"
          >
            Accessories
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <Button variant="ghost" size="icon" onClick={goToSearchPage}>
            <Search className="w-5 h-5" />
          </Button>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Profile Icon */}
          <Link to="#" className="hidden sm:block">
            <User className="w-6 h-6" />
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar (Toggled) */}
      {isSearchOpen && (
        <div className="border-b">
          <div className="container px-4 py-3 mx-auto max-w-7xl">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10 pr-24"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-0 top-0 h-10 flex">
                <Button
                  type="submit"
                  size="sm"
                  className="mr-1 h-10"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={toggleSearch}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container md:hidden px-4 pb-4 mx-auto bg-white">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-sm font-medium py-2 hover:text-primary"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium py-2 hover:text-primary"
              onClick={toggleMenu}
            >
              All Products
            </Link>
            <Link
              to="/products/electronics"
              className="text-sm font-medium py-2 hover:text-primary"
              onClick={toggleMenu}
            >
              Electronics
            </Link>
            <Link
              to="/products/clothing"
              className="text-sm font-medium py-2 hover:text-primary"
              onClick={toggleMenu}
            >
              Clothing
            </Link>
            <Link
              to="/products/accessories"
              className="text-sm font-medium py-2 hover:text-primary"
              onClick={toggleMenu}
            >
              Accessories
            </Link>
            {/* Profile link in mobile menu */}
            <Link
              to="#"
              className="text-sm font-medium py-2 hover:text-primary flex items-center"
              onClick={toggleMenu}
            >
              <User className="w-4 h-4 mr-2" />
              My Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
