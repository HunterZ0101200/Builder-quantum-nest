import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

const Cart = () => {
  const { items, clearCart } = useCart();

  const isCartEmpty = items.length === 0;

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      {isCartEmpty ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex items-center justify-center w-20 h-20 mb-6 bg-primary/10 rounded-full">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
          <p className="mb-8 text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </span>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>

            <div className="border rounded-lg">
              <div className="px-6">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>

              <div className="p-6 border-t">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/products" className="flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
