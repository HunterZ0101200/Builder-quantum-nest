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
      name: "Brake Pads Set",
      description:
        "Premium quality brake pads for enhanced stopping power and durability.",
      price: 2999,
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c8bc4fded?q=80&w=1000",
      category: "brake-system",
      inStock: true,
      featured: true,
      rating: 4.5,
    },
    {
      id: "2",
      name: "Engine Oil Filter",
      description:
        "High-efficiency oil filter to keep your engine running smoothly.",
      price: 599,
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1000",
      category: "engine-parts",
      inStock: true,
      featured: true,
      rating: 4.2,
    },
    {
      id: "3",
      name: "Air Filter",
      description:
        "Premium air filter for optimal engine performance and fuel efficiency.",
      price: 899,
      image:
        "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1000",
      category: "engine-parts",
      inStock: true,
      featured: false,
      rating: 4.0,
    },
    {
      id: "4",
      name: "Spark Plugs Set",
      description:
        "High-performance spark plugs for reliable ignition and engine efficiency.",
      price: 1299,
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000",
      category: "engine-parts",
      inStock: true,
      featured: false,
      rating: 4.8,
    },
    {
      id: "5",
      name: "Battery",
      description:
        "Reliable automotive battery with long life and maintenance-free operation.",
      price: 4999,
      image:
        "https://images.unsplash.com/photo-1609592806562-7b0b85be14b1?q=80&w=1000",
      category: "electrical",
      inStock: true,
      featured: true,
      rating: 4.3,
    },
    {
      id: "6",
      name: "Shock Absorbers",
      description:
        "Premium shock absorbers for smooth ride quality and vehicle stability.",
      price: 8999,
      image:
        "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1000",
      category: "suspension",
      inStock: true,
      featured: false,
      rating: 4.1,
    },
    {
      id: "7",
      name: "Transmission Fluid",
      description:
        "High-quality transmission fluid for smooth gear shifts and transmission longevity.",
      price: 799,
      image:
        "https://images.unsplash.com/photo-1606636635834-0269b8bbb8ad?q=80&w=1000",
      category: "engine-parts",
      inStock: true,
      featured: false,
      rating: 4.7,
    },
    {
      id: "8",
      name: "Tire Pressure Monitor",
      description:
        "Digital tire pressure monitoring system for enhanced safety and fuel efficiency.",
      price: 2499,
      image:
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000",
      category: "accessories",
      inStock: true,
      featured: true,
      rating: 4.6,
    },
  ];

  return mockProducts.find((product) => product.id === productId);
}

// Format price in Indian rupees
function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}
