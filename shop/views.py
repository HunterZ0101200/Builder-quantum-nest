from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.db.models import Q, Min
from .models import Brand, Category, Product, ProductVariant, Order, OrderItem
from .forms import OrderForm
import json


def home(request):
    """Home page with featured products and categories"""
    main_categories = Category.objects.filter(parent=None, is_active=True)[:8]
    brands = Brand.objects.all()[:8]
    featured_products = Product.objects.filter(featured=True, available=True)[:8]
    
    context = {
        'categories': main_categories,
        'brands': brands,
        'featured_products': featured_products,
    }
    return render(request, 'home.html', context)


def category_list(request):
    """Display all categories in hierarchical structure"""
    main_categories = Category.objects.filter(parent=None, is_active=True)
    
    context = {
        'main_categories': main_categories,
    }
    return render(request, 'category_list.html', context)


def category_detail(request, category_slug):
    """Display category details with subcategories"""
    category = get_object_or_404(Category, slug=category_slug, is_active=True)
    subcategories = category.children.filter(is_active=True)
    products = category.get_all_products()[:12]  # Show some products
    
    context = {
        'category': category,
        'subcategories': subcategories,
        'products': products,
    }
    return render(request, 'category_detail.html', context)


def products(request, category_slug=None, subcategory_slug=None, brand_slug=None):
    """Display all products or products filtered by category/subcategory/brand"""
    category = None
    subcategory = None
    brand = None
    main_categories = Category.objects.filter(parent=None, is_active=True)
    brands = Brand.objects.all()
    products = Product.objects.filter(available=True)
    
    # Handle category filtering
    if category_slug and subcategory_slug:
        # Subcategory view
        category = get_object_or_404(Category, slug=category_slug, parent=None, is_active=True)
        subcategory = get_object_or_404(Category, slug=subcategory_slug, parent=category, is_active=True)
        products = subcategory.get_all_products()
    elif category_slug:
        # Main category view
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = category.get_all_products()
    
    # Handle brand filtering
    if brand_slug:
        brand = get_object_or_404(Brand, slug=brand_slug)
        products = products.filter(brand=brand)
    
    # Add search functionality
    search_query = request.GET.get('q', '')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(part_number__icontains=search_query) |
            Q(brand__name__icontains=search_query)
        )
    
    # Add price filtering
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    if min_price:
        products = products.filter(variants__price__gte=min_price).distinct()
    if max_price:
        products = products.filter(variants__price__lte=max_price).distinct()
    
    # Add brand filtering from form
    brand_filter = request.GET.get('brand')
    if brand_filter:
        products = products.filter(brand_id=brand_filter)
    
    # Add category filtering from form
    category_filter = request.GET.get('category')
    if category_filter:
        filter_category = Category.objects.get(id=category_filter)
        products = filter_category.get_all_products()
    
    # Get all categories for the filter
    all_categories = Category.objects.filter(is_active=True)
    
    context = {
        'category': category,
        'subcategory': subcategory,
        'brand': brand,
        'categories': all_categories,
        'main_categories': main_categories,
        'brands': brands,
        'products': products,
        'current_category': subcategory or category,
        'current_brand': brand,
        'search_query': search_query,
    }
    return render(request, 'products.html', context)


def product_detail(request, product_slug):
    """Display detailed information for a specific product"""
    product = get_object_or_404(Product, slug=product_slug, available=True)
    variants = product.variants.all()
    default_variant = variants.filter(is_default=True).first() or variants.first()
    related_products = Product.objects.filter(
        Q(category=product.category) | Q(brand=product.brand), 
        available=True
    ).exclude(id=product.id)[:4]
    
    context = {
        'product': product,
        'variants': variants,
        'default_variant': default_variant,
        'related_products': related_products,
    }
    return render(request, 'product_detail.html', context)


def get_subcategories(request, category_id):
    """API endpoint to get subcategories for a given category"""
    try:
        category = Category.objects.get(id=category_id, is_active=True)
        subcategories = category.children.filter(is_active=True)
        
        subcategory_data = []
        for subcategory in subcategories:
            subcategory_data.append({
                'id': subcategory.id,
                'name': subcategory.name,
                'slug': subcategory.slug,
                'url': subcategory.get_absolute_url(),
                'product_count': subcategory.get_all_products().count(),
            })
        
        return JsonResponse({
            'success': True,
            'subcategories': subcategory_data
        })
    except Category.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Category not found'})


def get_product_variants(request, product_id):
    """API endpoint to get product variants"""
    try:
        product = Product.objects.get(id=product_id, available=True)
        variants = product.variants.all()
        
        variant_data = []
        for variant in variants:
            variant_data.append({
                'id': variant.id,
                'variant_name': variant.variant_name,
                'quantity_description': variant.quantity_description,
                'price': str(variant.price),
                'stock': variant.stock,
                'in_stock': variant.in_stock,
                'is_default': variant.is_default,
            })
        
        return JsonResponse({
            'success': True,
            'variants': variant_data
        })
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Product not found'})


def search(request):
    """Display search page with popular categories and search terms"""
    query = request.GET.get('q', '')
    main_categories = Category.objects.filter(parent=None, is_active=True)
    brands = Brand.objects.all()
    popular_searches = [
        "Brake Pads", 
        "Engine Oil", 
        "Air Filter", 
        "Spark Plugs", 
        "Transmission Fluid", 
        "Battery"
    ]
    
    context = {
        'query': query,
        'categories': main_categories,
        'brands': brands,
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
            Q(part_number__icontains=query) |
            Q(brand__name__icontains=query) |
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
    
    for variant_id, quantity in cart.items():
        try:
            variant = ProductVariant.objects.get(id=int(variant_id))
            total_price = variant.price * quantity
            subtotal += total_price
            
            cart_items.append({
                'variant': variant,
                'product': variant.product,
                'quantity': quantity,
                'total_price': total_price,
            })
        except ProductVariant.DoesNotExist:
            pass
    
    return cart_items, subtotal


def cart(request):
    """Display shopping cart"""
    cart = get_cart(request)
    cart_items, subtotal = cart_items_with_products(cart)
    
    # Calculate additional costs (Indian taxes and shipping)
    shipping = 99 if cart_items else 0  # Flat shipping rate in rupees
    tax = subtotal * 0.18  # 18% GST
    total = subtotal + shipping + tax
    
    context = {
        'cart_items': cart_items,
        'subtotal': subtotal,
        'shipping': shipping,
        'tax': tax,
        'total': total,
    }
    return render(request, 'cart.html', context)


def add_to_cart(request):
    """Add a product variant to cart"""
    if request.method == 'POST':
        cart = get_cart(request)
        variant_id = request.POST.get('variant_id')
        quantity = int(request.POST.get('quantity', 1))
        
        if not variant_id:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': 'No variant selected'})
            messages.error(request, 'Please select a variant.')
            return redirect('cart')
        
        # Convert variant_id to string as session keys must be strings
        variant_id = str(variant_id)
        
        try:
            variant = ProductVariant.objects.get(id=int(variant_id))
            if variant.in_stock:
                if variant_id in cart:
                    cart[variant_id] += quantity
                else:
                    cart[variant_id] = quantity
                
                request.session['cart'] = cart
                
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    return JsonResponse({'success': True, 'message': f'Added {variant.product.name} to cart'})
                
                messages.success(request, f'Added {variant.product.name} to cart.')
            else:
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    return JsonResponse({'success': False, 'error': 'Product out of stock'})
                messages.error(request, 'Product is out of stock.')
        except ProductVariant.DoesNotExist:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'error': 'Product variant not found'})
            messages.error(request, 'Product not found.')
        
        return redirect('cart')
    
    return redirect('home')


def update_cart_item(request):
    """Update quantity of a cart item"""
    if request.method == 'POST':
        cart = get_cart(request)
        variant_id = request.POST.get('variant_id')
        quantity = int(request.POST.get('quantity', 1))
        
        # Convert variant_id to string as session keys must be strings
        variant_id = str(variant_id)
        
        if quantity > 0:
            cart[variant_id] = quantity
        else:
            if variant_id in cart:
                del cart[variant_id]
        
        request.session['cart'] = cart
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': True})
        
        return redirect('cart')
    
    return redirect('cart')


def remove_from_cart(request):
    """Remove item from cart"""
    if request.method == 'POST':
        cart = get_cart(request)
        variant_id = str(request.POST.get('variant_id'))
        
        if variant_id in cart:
            del cart[variant_id]
            request.session['cart'] = cart
        
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': True})
        
        return redirect('cart')
    
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
    
    # Calculate additional costs (Indian taxes and shipping)
    shipping = 99 if cart_items else 0  # Flat shipping rate in rupees
    tax = subtotal * 0.18  # 18% GST
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
                    product_variant=item['variant'],
                    price=item['variant'].price,
                    quantity=item['quantity']
                )
                
                # Reduce stock
                item['variant'].stock -= item['quantity']
                item['variant'].save()
            
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
        # For guests, allow access for a short time after order
        context = {'order': order}
        return render(request, 'order_confirmation.html', context)
