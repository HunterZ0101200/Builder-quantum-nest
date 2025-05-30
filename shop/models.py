from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.contrib.auth.models import User
from mptt.models import MPTTModel, TreeForeignKey


class Brand(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='brands/', blank=True)
    
    class Meta:
        ordering = ('name',)
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('products_by_brand', args=[self.slug])
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Category(MPTTModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    is_active = models.BooleanField(default=True)
    
    class MPTTMeta:
        order_insertion_by = ['name']
    
    class Meta:
        verbose_name_plural = 'Categories'
        unique_together = ('slug', 'parent')
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name} → {self.name}"
        return self.name
    
    def get_absolute_url(self):
        if self.parent:
            return reverse('products_by_subcategory', args=[self.parent.slug, self.slug])
        return reverse('products_by_category', args=[self.slug])
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_full_path(self):
        """Get the full category path like 'Engine Parts / Filters / Air Filters'"""
        if self.parent:
            return f"{self.parent.get_full_path()} / {self.name}"
        return self.name
    
    def get_all_children(self):
        """Get all descendant categories"""
        return self.get_descendants(include_self=False)
    
    def get_all_products(self):
        """Get all products in this category and its subcategories"""
        categories = self.get_descendants(include_self=True)
        return Product.objects.filter(category__in=categories, available=True)
    
    @property
    def is_parent_category(self):
        """Check if this category has subcategories"""
        return self.children.filter(is_active=True).exists()
    
    @property
    def main_categories(self):
        """Get all root level categories"""
        return Category.objects.filter(parent=None, is_active=True)


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products')
    image = models.ImageField(upload_to='products/')
    available = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    # Part-specific fields
    part_number = models.CharField(max_length=100, blank=True, help_text="Manufacturer part number")
    compatibility = models.TextField(blank=True, help_text="Compatible vehicle models/years")
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text="Weight in kg")
    dimensions = models.CharField(max_length=200, blank=True, help_text="L x W x H in cm")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ('name',)
    
    def __str__(self):
        return f"{self.brand.name} {self.name}"
    
    def get_absolute_url(self):
        return reverse('product_detail', args=[self.slug])
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.brand.name} {self.name}")
        super().save(*args, **kwargs)
    
    @property
    def price_range(self):
        """Get the price range for this product"""
        variants = self.variants.all()
        if variants:
            prices = [variant.price for variant in variants]
            min_price = min(prices)
            max_price = max(prices)
            if min_price == max_price:
                return f"₹{min_price:,.0f}"
            return f"₹{min_price:,.0f} - ₹{max_price:,.0f}"
        return "Price not available"
    
    @property
    def starting_price(self):
        """Get the lowest price for this product"""
        variants = self.variants.all()
        if variants:
            return min(variant.price for variant in variants)
        return 0
    
    @property
    def in_stock(self):
        """Check if any variant is in stock"""
        return self.variants.filter(stock__gt=0).exists()


class ProductVariant(models.Model):
    """Different quantities/specifications of the same product with different prices"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    variant_name = models.CharField(max_length=100, help_text="e.g., Single Pack, 4-Pack, Set of 6, etc.")
    quantity_description = models.CharField(max_length=200, help_text="e.g., 1 Filter, 4 Spark Plugs, Set of 6 Bolts")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True, help_text="Stock Keeping Unit")
    is_default = models.BooleanField(default=False, help_text="Show this variant by default")
    
    class Meta:
        ordering = ('price',)
        unique_together = ('product', 'variant_name')
    
    def __str__(self):
        return f"{self.product.name} - {self.variant_name}"
    
    @property
    def in_stock(self):
        return self.stock > 0
    
    @property
    def formatted_price(self):
        """Return price formatted with rupee symbol"""
        return f"₹{self.price:,.0f}"
    
    def save(self, *args, **kwargs):
        # Ensure only one default variant per product
        if self.is_default:
            ProductVariant.objects.filter(product=self.product).update(is_default=False)
        super().save(*args, **kwargs)


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='orders')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True, help_text="Company/Shop name")
    address = models.CharField(max_length=250)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    paid = models.BooleanField(default=False)
    notes = models.TextField(blank=True, help_text="Special instructions or notes")
    
    class Meta:
        ordering = ('-created',)
    
    def __str__(self):
        return f'Order {self.id}'
    
    def get_total_cost(self):
        return sum(item.get_cost() for item in self.items.all())
    
    def get_formatted_total(self):
        """Return total cost formatted with rupee symbol"""
        return f"₹{self.get_total_cost():,.2f}"
    
    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f'OrderItem {self.id}'
    
    def get_cost(self):
        return self.price * self.quantity
    
    def get_formatted_cost(self):
        """Return cost formatted with rupee symbol"""
        return f"₹{self.get_cost():,.2f}"
    
    @property
    def product(self):
        return self.product_variant.product


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ('-created',)
        unique_together = ('product', 'user')
    
    def __str__(self):
        return f'Review by {self.user.username} on {self.product.name}'
