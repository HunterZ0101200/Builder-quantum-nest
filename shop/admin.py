from django.contrib import admin
from .models import Category, Product, Order, OrderItem, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'stock', 'available', 'featured', 'rating']
    list_filter = ['available', 'featured', 'category', 'created', 'updated']
    list_editable = ['price', 'stock', 'available', 'featured']
    prepopulated_fields = {'slug': ('name',)}


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['product']
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'city', 'paid', 'status', 'created']
    list_filter = ['paid', 'status', 'created', 'updated']
    inlines = [OrderItemInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created']
    list_filter = ['rating', 'created']
