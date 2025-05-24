from .views import get_cart, cart_items_with_products


def cart_processor(request):
    """
    Context processor to add cart information to all templates
    """
    cart = get_cart(request)
    cart_items, subtotal = cart_items_with_products(cart)
    
    return {
        'cart_count': len(cart_items),
        'cart_subtotal': subtotal,
    }
