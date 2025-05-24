from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.db.models import Q
from .models import Category, Product, Order, OrderItem
from .forms import OrderForm
import json


def home(request):
    """Home page with featured products and categories"""
    categories = Category.objects.all()
    featured_products = Product.objects.filter(featured=True, available=True)[:8]
    
    context = {
        'categories': categories,
        'featured_products': featured_products,
    }
    return render(request, 'home.html', context)


def products(request, category_slug=None):
    """Display all products or products filtered by category"""
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(available=True)
    
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
    
    context = {
        'category': category,
        'categories': categories,
        'products': products,
        'current_category': category,
    }
    return render(request, 'products.html', context)


def product_detail(request, product_slug):
    """Display detailed information for a specific product"""
    product = get_object_or_404(Product, slug=product_slug, available=True)
    related_products = Product.objects.filter(
        category=product.category, 
        available=True
    ).exclude(id=product.id)[:4]
    
    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'product_detail.html', context)


def search(request):
    """Display search page with popular categories and search terms"""
    query = request.GET.get('q', '')
    categories = Category.objects.all()
    popular_searches = [
        "Headphones", 
        "Smart Watch", 
        "Leather Wallet", 
        "Backpack", 
        "T-Shirt", 
        "Coffee Mug"
    ]
    
    context = {
        'query': query,
        'categories': categories,
        'popular_searches': popular_searches,
    }
    return render(request, 'search.html', context)


def search_results(request):
    """Display search results based on query"""
    query = request.GET.get('q', '')
    products = []
    
    if query:
        products = Product.objects.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query) | 
            Q(category__name__icontains=query),
            available=True
        )
    
    context = {
        'query': query,
        'products': products,
        'filters_visible': False,
    }
    return render(request, 'search_results.html', context)


def get_cart(request):
    """Helper function to get or create cart in session"""
    cart = request.session.get('cart', {})
    return cart


def cart_items_with_products(cart):
    """Helper function to get cart items with product details"""
    cart_items = []
    subtotal = 0
    
    for product_id, quantity in cart.items():
        try:
            product = Product.objects.get(id=int(product_id), available=True)
            total_price = product.price * quantity
            subtotal += total_price
            
            cart_items.append({
                'product': product,
                'quantity': quantity,
                'total_price': total_price,
            })
        except Product.DoesNotExist:
            pass
    
    return cart_items, subtotal


def cart(request):
    """Display shopping cart"""
    cart = get_cart(request)
    cart_items, subtotal = cart_items_with_products(cart)
    
    # Calculate additional costs
    shipping = 4.99 if cart_items else 0
    tax = subtotal * 0.1  # 10% tax
    total = subtotal + shipping + tax
    
    context = {
        'cart_items': cart_items,
        'subtotal': subtotal,
        'shipping': shipping,
        'tax': tax,
        'total': total,
    }
    return render(request, 'cart.html', context)


def add_to_cart(request, product_id):
    """Add a product to cart"""
    if request.method == 'POST':
        cart = get_cart(request)
        quantity = int(request.POST.get('quantity', 1))
        
        # Convert product_id to string as session keys must be strings
        product_id = str(product_id)
        
        if product_id in cart:
            cart[product_id] += quantity
        else:
            cart[product_id] = quantity
        
        request.session['cart'] = cart
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': True})
        
        messages.success(request, 'Product added to cart.')
        return redirect('cart')
    
    return redirect('product_detail', product_id=product_id)


def update_cart_item(request, product_id):
    """Update quantity of a cart item"""
    if request.method == 'POST':
        cart = get_cart(request)
        quantity = int(request.POST.get('quantity', 1))
        
        # Convert product_id to string as session keys must be strings
        product_id = str(product_id)
        
        if quantity > 0:
            cart[product_id] = quantity
        else:
            if product_id in cart:
                del cart[product_id]
        
        request.session['cart'] = cart
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': True})
        
        return redirect('cart')
    
    return redirect('cart')


def remove_from_cart(request, product_id):
    """Remove item from cart"""
    cart = get_cart(request)
    product_id = str(product_id)
    
    if product_id in cart:
        del cart[product_id]
        request.session['cart'] = cart
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'success': True})
    
    return redirect('cart')


def clear_cart(request):
    """Clear all items in cart"""
    request.session['cart'] = {}
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'success': True})
    
    return redirect('cart')


def checkout(request):
    """Display checkout page"""
    cart = get_cart(request)
    
    # Redirect to cart if cart is empty
    if not cart:
        messages.warning(request, 'Your cart is empty.')
        return redirect('cart')
    
    cart_items, subtotal = cart_items_with_products(cart)
    
    # Calculate additional costs
    shipping = 4.99 if cart_items else 0
    tax = subtotal * 0.1  # 10% tax
    total = subtotal + shipping + tax
    
    context = {
        'cart_items': cart_items,
        'subtotal': subtotal,
        'shipping': shipping,
        'tax': tax,
        'total': total,
        'form': OrderForm(),
    }
    return render(request, 'checkout.html', context)


def place_order(request):
    """Process order placement"""
    if request.method == 'POST':
        cart = get_cart(request)
        
        if not cart:
            messages.warning(request, 'Your cart is empty.')
            return redirect('cart')
        
        form = OrderForm(request.POST)
        
        if form.is_valid():
            # Create order
            order = form.save(commit=False)
            if request.user.is_authenticated:
                order.user = request.user
            order.save()
            
            # Create order items
            cart_items, subtotal = cart_items_with_products(cart)
            
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    price=item['product'].price,
                    quantity=item['quantity']
                )
            
            # Clear cart
            request.session['cart'] = {}
            
            # Redirect to confirmation page
            return redirect('order_confirmation', order_id=order.id)
    
    # If form is not valid or method is not POST, redirect to checkout
    return redirect('checkout')


def order_confirmation(request, order_id):
    """Display order confirmation page"""
    order = get_object_or_404(Order, id=order_id)
    
    # Security check - only owner or staff can see order
    if request.user.is_authenticated and (request.user == order.user or request.user.is_staff):
        context = {'order': order}
        return render(request, 'order_confirmation.html', context)
    else:
        messages.warning(request, 'You do not have permission to view this order.')
        return redirect('home')
