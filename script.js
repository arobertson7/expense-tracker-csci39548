/***********************
  Data Models
********************** */

class Expense {
  constructor(id, description, amount, category, date) {
    this.id = id;
    this.description = description; // string
    this.amount = amount; // number
    this.category = category; // string
    this.date = date; // date
  }
}

class ExpenseTracker {
  constructor() {
    this.expense_list = [];
    this.next_expense_id = 1;
  }

  // adds to front of expense_list (to render on top of html list) and increments id
  addExpense(description, amount, category, date) {
    this.expense_list.unshift(new Expense(this.next_expense_id++, description, amount, category, date));
    render();
  }

  removeExpense(id) {
    // assigns a new array to expense_list excluding the expense with removal id
    this.expense_list = this.expense_list.filter(expense => expense.id !== id);
    render();
  }
}

/***********************
  DOM Rendering
********************** */

function render() {
  // RENDER EXPENSE LIST & FILTERED TOTAL
  const expense_list_el = document.getElementById('expense-list');
  expense_list_el.replaceChildren(); // clear all children for refresh

  const filtered_expense_list = getFilteredExpenseList();
  let filtered_total = 0;
  for (const expense of filtered_expense_list) {
    const list_item_el = document.createElement('li');
    list_item_el.classList.add('expense-item');
    list_item_el.setAttribute('data-expense-id', String(expense.id));

    const card_el = document.createElement('div');
    card_el.classList.add('expense-list-card');

    const card_header = document.createElement('h4');
    card_header.textContent = expense.description;

    const card_amount = document.createElement('p');
    card_amount.textContent = "$" + getFormattedAmount(expense.amount);

    const card_category = document.createElement('p');
    card_category.textContent = expense.category;

    const card_date = document.createElement('p');
    card_date.textContent = expense.date.toDateString();

    const delete_button = document.createElement('button');
    delete_button.textContent = "Delete";
    delete_button.addEventListener('click', (e) => {
      expense_tracker.removeExpense(expense.id);
    });

    card_el.appendChild(card_header);
    card_el.appendChild(card_amount);
    card_el.appendChild(card_category);
    card_el.appendChild(card_date);
    card_el.appendChild(delete_button);

    list_item_el.appendChild(card_el);

    expense_list_el.appendChild(list_item_el);

    filtered_total += expense.amount;
  }

  let filter_applied = false;
  const checkboxes = document.getElementById('category-dropdown').querySelectorAll('.category-checkbox');
  checkboxes.forEach((cb) => filter_applied = (filter_applied || cb.checked));

  const total_header = document.getElementById('current-filter-totals').querySelector('h4');
  total_header.firstChild.textContent = filter_applied ? "Filtered Total: " : "Total: ";

  const filtered_total_el = document.getElementById('filtered-total');
  filtered_total_el.textContent = "$" + getFormattedAmount(filtered_total);

  // RENDER OVERALL TOTAL & CATEGORY TOTALS
  const overall_total_el = document.getElementById('overall-total');
  const food_and_drinks_el = document.getElementById('food-&-drinks-total');
  const entertainment_el = document.getElementById('entertainment-total');
  const home_goods_el = document.getElementById('home-goods-total');
  const travel_el = document.getElementById('travel-total');
  const payments_el = document.getElementById('payments-total');
  const other_el = document.getElementById('other-total');

  overall_total_el.textContent = "$" + getFormattedAmount(getCategoryTotal("all"));
  food_and_drinks_el.textContent = "$" + getFormattedAmount(getCategoryTotal("food-&-drinks"));
  entertainment_el.textContent = "$" + getFormattedAmount(getCategoryTotal("entertainment"));
  home_goods_el.textContent = "$" + getFormattedAmount(getCategoryTotal("home-goods"));
  travel_el.textContent = "$" + getFormattedAmount(getCategoryTotal("travel"));
  payments_el.textContent = "$" + getFormattedAmount(getCategoryTotal("payments"));
  other_el.textContent = "$" + getFormattedAmount(getCategoryTotal("other"));
}

function getFilteredExpenseList() {
  let expenses = expense_tracker.expense_list;
  // 1. Filter by category
  const dropdown = document.getElementById('category-dropdown');
  const checkboxes = dropdown.querySelectorAll('.category-checkbox');
  const selected_categories = new Set();
  checkboxes.forEach((cb) => {
    if (cb.checked) {
      selected_categories.add(cb.value);
    }
  });
  if (selected_categories.size !== 0) { // if 0 -> All Categories
    expenses = expenses.filter((expense) => selected_categories.has(expense.category));
  }
  // 2. Sort
  const sort_by_el = document.getElementById('sort-by');
  const sort_selection = sort_by_el.value;
  if (sort_selection === "amount-desc") {
    expenses.sort((a, b) => b.amount - a.amount);
  } else if (sort_selection === "amount-asc") {
    expenses.sort((a, b) => a.amount - b.amount);
  } else if (sort_selection === "date-earliest") {
    expenses.sort((a, b) => a.date - b.date);
  } else if (sort_selection === "date-latest") {
    expenses.sort((a, b) => b.date - a.date);
  }
  return expenses; // no sort applied
}

/************************************************************************************
  Event Listener Initializations (Drop down checkbox menu, Add Expense Button, etc.)
********************************************************************************** */

document.addEventListener('DOMContentLoaded', () => {
  // *** THEME TOGGLE LOGIC ***
  const theme_toggle_button = document.getElementById('theme-toggle');

  theme_toggle_button.addEventListener('click', () => {
    const is_light = document.documentElement.getAttribute('data-theme') === 'light';
    if (is_light) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });

  // *** LIST FILTERS LOGIC ***
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
    cb.addEventListener('change', render);
  });

  // Initial update
  updateTriggerText();

  // Bind change events to sort-by (render() handles the sort)
  const sort_by_el = document.getElementById('sort-by');
  sort_by_el.addEventListener('change', () => {
    render();
  });

  // *** ADD EXPENSE BUTTON LOGIC ***
  const add_button = document.getElementById('add-expense-button');

  const description_input = document.getElementById('add-expense-description');
  const amount_input = document.getElementById('add-expense-amount');
  const category_input = document.getElementById('add-expense-category-options');
  const date_input = document.getElementById('add-expense-date');

  add_button.addEventListener('click', (e) => {
    const cleaned_amount_num = Number(amount_input.value.replace(/[^\d.]/g, ""));
    // handle invalid form inputs
    if (description_input.value === "") {
      add_button.setAttribute('data-error', 'Please include a description.');
    } else if (amount_input.value === "" || cleaned_amount_num <= 0) {
      console.log(cleaned_amount_num)
      add_button.setAttribute('data-error', 'Please include an amount greater than $0');
    } else if (category_input.value === "") {
      add_button.setAttribute('data-error', 'Please select a category for this expense.');
    } else if (date_input.value === "") {
      add_button.setAttribute('data-error', 'Please select a due date.');
    } else {
      // form is correctly filled
      add_button.removeAttribute('data-error');
      expense_tracker.addExpense(description_input.value, cleaned_amount_num, category_input.value, new Date(date_input.value));
      document.getElementById('add-expense-form').reset();
    }
  });

  // *** REAL-TIME FORMATTING OF 'AMOUNT' INPUT ***
  amount_input.addEventListener('input', (e) => {
    let cursorPosition = amount_input.selectionStart;
    let originalLength = amount_input.value.length;

    // Clean the input: Remove everything except digits and the FIRST period
    let val = amount_input.value.replace(/[^\d.]/g, "");

    // Enforce only one decimal point
    const periodIndex = val.indexOf('.');
    if (periodIndex !== -1) {
      // Split by first period, remove any subsequent periods from the rest of the string
      val = val.substring(0, periodIndex + 1) + val.substring(periodIndex + 1).replace(/\./g, "");

      // Enforce max 2 decimal places (truncate anything after dd)
      const parts = val.split('.');
      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        val = parts.join('.');
      }
    }

    // Format the clean string
    if (val === "") {
      amount_input.value = "";
      return;
    }

    let formattedValue = "";
    if (val.disabled || val === ".") {
      formattedValue = "$.";
    } else {
      const parts = val.split('.');
      const integerPart = parseInt(parts[0], 10) || 0;

      // Format the integer side with commas
      const formattedInteger = integerPart.toLocaleString('en-US');

      // Reconstruct with the decimal side if it exists
      if (parts.length > 1) {
        formattedValue = `$${formattedInteger}.${parts[1]}`;
      } else {
        formattedValue = `$${formattedInteger}`;
      }
    }

    // Update the input value
    amount_input.value = formattedValue;

    // Fix cursor jumping: Adjust cursor position relative to added/removed commas
    let newLength = formattedValue.length;
    cursorPosition = cursorPosition + (newLength - originalLength);
    amount_input.setSelectionRange(cursorPosition, cursorPosition);
  });

});

/*****************************
  Helper functions
**************************** */

// Input: Number | Output: String | Adds commas and decimal as necessary
function getFormattedAmount(amount) {
  const decimal_precision = Number.isInteger(amount) ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return amount.toLocaleString('en-US', decimal_precision);
}

function getCategoryTotal(category) {
  const expenses = expense_tracker.expense_list;
  if (category === "all") {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  }
  return expenses.filter((expense) => expense.category === category)
    .reduce((acc, expense) => acc + expense.amount, 0);

}

/*****************************
  Global Variables
**************************** */

const expense_tracker = new ExpenseTracker();
expense_tracker.addExpense("books", 110, "entertainment", new Date());