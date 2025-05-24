import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

export const CartSummary = () => {
  const { subtotal } = useCart();

  // Calculate additional costs
  const shipping = subtotal > 0 ? 4.99 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-medium">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-sm font-medium">${subtotal.toFixed(2)}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Shipping</p>
          <p className="text-sm font-medium">${shipping.toFixed(2)}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Tax (10%)</p>
          <p className="text-sm font-medium">${tax.toFixed(2)}</p>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <p className="text-base font-medium">Total</p>
            <p className="text-base font-bold">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button asChild className="w-full">
          <Link to={subtotal > 0 ? "/checkout" : "#"}>Proceed to Checkout</Link>
        </Button>

        <p className="mt-2 text-xs text-center text-gray-500">
          Taxes and shipping calculated at checkout
        </p>
      </div>
    </div>
  );
};
