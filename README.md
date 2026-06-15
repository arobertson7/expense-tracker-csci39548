# Expense Tracker

Welcome to my Expense Tracker web application! This project was built to demonstrate dynamic UI state management, real-time DOM manipulation, use of localStorage, and interacting with APIs.

The application is a clean, single-page dashboard featuring:
- **Responsive View Toggling:** A unified workspace where the "Add Expense" form and the main expense list toggle in-place, optimized for both desktop grid views and compact mobile layouts.
- **Dynamic Filtering & Sorting:** Category-based multi-select filtering via a custom dropdown checklist and amount/date sorting controls that update list results and running totals instantly.
- **Real-Time Input Validation & Formatting:** Real-time formatting for currency inputs as you type, and clean, container-padded validation warning alerts on invalid submissions.
- **API Currency Conversion:** Dynamic conversion of totals and individual items from USD to EUR utilizing live exchange rate data from a public API.
- **Persistent State:** Saves and retrieves expense data locally using browser `localStorage` to preserve user records across page reloads.

It is built using vanilla HTML, vanilla CSS (utilizing CSS variables for twilight-slate dark mode and light mode toggles), and vanilla JavaScript.