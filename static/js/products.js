document.addEventListener("DOMContentLoaded", function () {
  // Toggle filters on mobile
  const filtersToggle = document.getElementById("filtersToggle");
  const filtersSidebar = document.getElementById("filtersSidebar");

  if (filtersToggle && filtersSidebar) {
    filtersToggle.addEventListener("click", function () {
      filtersSidebar.classList.toggle("active");

      // Update button text
      if (filtersSidebar.classList.contains("active")) {
        filtersToggle.innerHTML =
          '<i class="fas fa-sliders-h"></i> Hide Filters';
      } else {
        filtersToggle.innerHTML =
          '<i class="fas fa-sliders-h"></i> Show Filters';
      }
    });
  }

  // Price range slider
  const priceSlider = document.getElementById("priceSlider");
  const priceMin = document.getElementById("priceMin");
  const priceMax = document.getElementById("priceMax");

  if (priceSlider && priceMax) {
    priceSlider.addEventListener("input", function () {
      priceMax.textContent = this.value;

      // In a real application, this would trigger a form submit or AJAX request
      // For now, we'll just console log
      console.log(`Price range: $${priceMin.textContent} - $${this.value}`);
    });
  }

  // Product search
  const productSearch = document.getElementById("productSearch");
  const clearSearch = document.getElementById("clearSearch");

  if (productSearch) {
    productSearch.addEventListener("input", function () {
      // Show/hide clear button
      if (clearSearch) {
        if (this.value) {
          clearSearch.style.display = "flex";
        } else {
          clearSearch.style.display = "none";
        }
      }

      // In a real application, this would trigger search filtering
      console.log(`Search query: ${this.value}`);
    });
  }

  if (clearSearch && productSearch) {
    clearSearch.addEventListener("click", function () {
      productSearch.value = "";
      this.style.display = "none";

      // Trigger search update
      console.log("Search cleared");
    });
  }

  // Category checkboxes
  const categoryCheckboxes = document.querySelectorAll(
    ".category-checkbox input",
  );

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // In a real application, this would trigger filtering
      console.log(`Category ${this.value}: ${this.checked}`);
    });
  });

  // Clear all filters
  const clearFilters = document.getElementById("clearFilters");

  if (clearFilters) {
    clearFilters.addEventListener("click", function () {
      // Reset price slider
      if (priceSlider && priceMax) {
        priceSlider.value = 500;
        priceMax.textContent = "500";
      }

      // Reset search
      if (productSearch && clearSearch) {
        productSearch.value = "";
        clearSearch.style.display = "none";
      }

      // Reset category checkboxes
      categoryCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });

      console.log("All filters cleared");
    });
  }
});
