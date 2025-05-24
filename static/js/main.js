document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("active");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        if (mobileNav.classList.contains("active")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-times");
        } else {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  }

  // Cart functionality
  setupCart();
});

// Cart functionality
function setupCart() {
  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCount(cart);

  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const productId = this.dataset.productId;

      // Make API call to get product data (or use mock data)
      // For the HTML template, we'll simulate this with fake data
      const product = getMockProduct(productId);

      if (product) {
        addToCart(product);
        showToast(`Added ${product.name} to cart`);
      }
    });
  });
}

function addToCart(product, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex(
    (item) => item.product.id === product.id,
  );

  if (existingItemIndex !== -1) {
    // Update quantity if product already in cart
    cart[existingItemIndex].quantity += quantity;
    showToast(`Updated ${product.name} quantity in cart`);
  } else {
    // Add new item to cart
    cart.push({ product, quantity });
    showToast(`Added ${product.name} to cart`);
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart count
  updateCartCount(cart);
}

function updateCartCount(cart) {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Hide count if zero
    if (totalItems === 0) {
      cartCount.style.display = "none";
    } else {
      cartCount.style.display = "flex";
    }
  }
}

function showToast(message) {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  // Add styles
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "12px 20px",
    backgroundColor: "var(--color-primary)",
    color: "white",
    borderRadius: "var(--border-radius)",
    boxShadow: "var(--shadow-md)",
    zIndex: "1000",
    opacity: "0",
    transition: "opacity 0.3s ease",
  });

  // Add to DOM
  document.body.appendChild(toast);

  // Trigger transition
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Mock function to simulate getting product data
// In a real application, this would be an API call
function getMockProduct(productId) {
  const mockProducts = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      description:
        "Premium noise-cancelling headphones with exceptional sound quality and comfort for extended use.",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
      category: "electronics",
      inStock: true,
      featured: true,
      rating: 4.5,
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      description:
        "Track your fitness goals with this sleek, feature-packed smartwatch with heart rate monitoring.",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=989",
      category: "electronics",
      inStock: true,
      featured: true,
      rating: 4.2,
    },
    {
      id: "3",
      name: "Organic Cotton T-Shirt",
      description:
        "Comfortable, eco-friendly t-shirt made from 100% organic cotton, perfect for everyday wear.",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987",
      category: "clothing",
      inStock: true,
      featured: false,
      rating: 4.0,
    },
    {
      id: "4",
      name: "Stainless Steel Water Bottle",
      description:
        "Durable, leak-proof water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?q=80&w=987",
      category: "home",
      inStock: true,
      featured: false,
      rating: 4.8,
    },
    {
      id: "5",
      name: "Leather Wallet",
      description:
        "Classic leather wallet with multiple card slots and RFID protection technology.",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=987",
      category: "accessories",
      inStock: true,
      featured: true,
      rating: 4.3,
    },
    {
      id: "6",
      name: "Wireless Charging Pad",
      description:
        "Fast wireless charging for all Qi-enabled devices, with sleek minimalist design.",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1005",
      category: "electronics",
      inStock: true,
      featured: false,
      rating: 4.1,
    },
    {
      id: "7",
      name: "Ceramic Coffee Mug Set",
      description:
        "Set of 4 hand-crafted ceramic mugs, perfect for your morning coffee or afternoon tea.",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1010",
      category: "home",
      inStock: true,
      featured: false,
      rating: 4.7,
    },
    {
      id: "8",
      name: "Backpack",
      description:
        "Durable backpack with laptop compartment and multiple pockets for organization.",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=969",
      category: "accessories",
      inStock: true,
      featured: true,
      rating: 4.6,
    },
  ];

  return mockProducts.find((product) => product.id === productId);
}
