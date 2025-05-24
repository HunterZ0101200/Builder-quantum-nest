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

  // Clear filters
  const clearFilters = document.getElementById("clearFilters");

  if (clearFilters && priceSlider && priceMax) {
    clearFilters.addEventListener("click", function () {
      priceSlider.value = 500;
      priceMax.textContent = "500";

      // In a real application, reset other filters too
      // Then trigger search/filter update
      console.log("Filters cleared");
    });
  }
});
