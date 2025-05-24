from django.urls import path
from . import views

urlpatterns = [
    # Home and product browsing
    path('', views.home, name='home'),
    path('products/', views.products, name='products'),
    path('products/<slug:category_slug>/', views.products, name='products_by_category'),
    path('product/<slug:product_slug>/', views.product_detail, name='product_detail'),
    
    # Search
    path('search/', views.search, name='search'),
    path('search-results/', views.search_results, name='search_results'),
    
    # Cart
    path('cart/', views.cart, name='cart'),
    path('add-to-cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('update-cart-item/<int:product_id>/', views.update_cart_item, name='update_cart_item'),
    path('remove-from-cart/<int:product_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('clear-cart/', views.clear_cart, name='clear_cart'),
    
    # Checkout
    path('checkout/', views.checkout, name='checkout'),
    path('place-order/', views.place_order, name='place_order'),
    path('order-confirmation/<int:order_id>/', views.order_confirmation, name='order_confirmation'),
]
