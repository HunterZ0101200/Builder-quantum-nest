document.addEventListener("DOMContentLoaded", function () {
  // Load cart data
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Clear cart button
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", function () {
      // Clear cart in localStorage
      localStorage.setItem("cart", JSON.stringify([]));

      // Update cart count
      updateCartCount([]);

      // Reload page to show empty cart
      location.reload();
    });
  }

  // Quantity increase/decrease buttons
  const increaseButtons = document.querySelectorAll(".increase-quantity");
  const decreaseButtons = document.querySelectorAll(".decrease-quantity");

  increaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId;
      updateCartItemQuantity(productId, 1);
    });
  });

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId;
      updateCartItemQuantity(productId, -1);
    });
  });

  // Remove item buttons
  const removeButtons = document.querySelectorAll(".remove-item");

  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId;
      removeCartItem(productId);
    });
  });
});

function updateCartItemQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Find the item
  const itemIndex = cart.findIndex((item) => item.product.id === productId);

  if (itemIndex !== -1) {
    // Update quantity
    cart[itemIndex].quantity += change;

    // Remove if quantity is 0 or less
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count
    updateCartCount(cart);

    // Reload page to reflect changes
    // In a real app, you might update the DOM without reloading
    location.reload();
  }
}

function removeCartItem(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Remove the item
  cart = cart.filter((item) => item.product.id !== productId);

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart count
  updateCartCount(cart);

  // Reload page to reflect changes
  location.reload();
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
