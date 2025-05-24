document.addEventListener("DOMContentLoaded", function () {
  // Quantity controls
  const decreaseBtn = document.getElementById("decreaseQuantity");
  const increaseBtn = document.getElementById("increaseQuantity");
  const quantityValue = document.getElementById("quantityValue");
  const addToCartBtn = document.getElementById("addToCartBtn");

  let quantity = 1;

  if (decreaseBtn && increaseBtn && quantityValue) {
    decreaseBtn.addEventListener("click", function () {
      if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
      }
    });

    increaseBtn.addEventListener("click", function () {
      quantity++;
      quantityValue.textContent = quantity;
    });
  }

  // Add to cart with quantity
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      const productId = this.dataset.productId;

      // Get product data (would be an API call in a real app)
      const product = getMockProduct(productId);

      if (product) {
        // Add to cart with the selected quantity
        addToCart(product, quantity);
      }
    });
  }
});

// This function would typically be in a shared file but is duplicated here for completeness
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
    // Other products would be listed here
  ];

  return mockProducts.find((product) => product.id === productId);
}
