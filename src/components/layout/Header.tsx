import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export const Header = () => {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

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
          </nav>
        </div>
      )}
    </header>
  );
};
