import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products/electronics"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products/clothing"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/products/accessories"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/products/home"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Home & Kitchen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Stay Connected
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              Subscribe to our newsletter for updates on new products and
              special promotions.
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ShopFusion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
