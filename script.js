/******************************************************************
  Expense List FILTERS LOGIC (Drop down checkbox menu, etc.)
***************************************************************** */

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.getElementById('category-dropdown');
  const trigger = document.getElementById('filter-category-trigger');
  const triggerText = trigger.querySelector('.dropdown-trigger-text');
  const checkboxes = dropdown.querySelectorAll('.category-checkbox');

  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  function openDropdown() {
    dropdown.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    dropdown.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  // Prevent dropdown closing when clicking inside the menu
  dropdown.querySelector('.dropdown-menu').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  // Handle escape key to close dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  // Update trigger text based on selected checkboxes
  function updateTriggerText() {
    const selected = [];
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        // Find label text associated with the checkbox
        const textNode = cb.nextElementSibling;
        if (textNode) {
          selected.push(textNode.textContent.trim());
        }
      }
    });

    if (selected.length === 0 || selected.length === checkboxes.length) {
      triggerText.textContent = 'All Categories';
    } else if (selected.length === 1) {
      triggerText.textContent = selected[0];
    } else if (selected.length === 2) {
      triggerText.textContent = selected.join(', ');
    } else {
      triggerText.textContent = `${selected.length} Categories`;
    }
  }

  // Bind change events to checkboxes
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', updateTriggerText);
  });

  // Initial update
  updateTriggerText();
});

/******************************************************************
  END Expense List FILTERS LOGIC
***************************************************************** */