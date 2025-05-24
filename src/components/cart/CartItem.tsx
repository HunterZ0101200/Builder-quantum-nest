import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start py-6 border-b">
      <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-md">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col flex-1 mt-4 sm:mt-0 sm:ml-6">
        <div className="flex justify-between">
          <Link
            to={`/product/${product.id}`}
            className="text-base font-medium hover:underline"
          >
            {product.name}
          </Link>
          <p className="ml-4 text-base font-medium">
            ${(product.price * quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={handleDecrease}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <span className="text-sm">{quantity}</span>

            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={handleIncrease}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
