document.addEventListener("DOMContentLoaded", function () {
  // Checkout form submission
  const checkoutForm = document.getElementById("checkoutForm");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // In a real app, validate form and process payment
      if (placeOrderBtn) {
        // Show processing state
        const originalText = placeOrderBtn.textContent;
        placeOrderBtn.textContent = "Processing...";
        placeOrderBtn.disabled = true;

        // Simulate API call with timeout
        setTimeout(function () {
          // Clear cart after successful order
          localStorage.setItem("cart", JSON.stringify([]));

          // Show success message and redirect
          showToast("Order placed successfully!");

          // Redirect to home page after a short delay
          setTimeout(function () {
            window.location.href = "/";
          }, 1500);
        }, 2000);
      }
    });
  }
});

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
    backgroundColor: "var(--color-success)",
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
