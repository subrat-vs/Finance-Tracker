# FinTrack

A client-side personal finance tracker built with plain HTML, Tailwind CSS, and vanilla JavaScript. No frameworks, no backend — just DOM manipulation and `localStorage`.

## Features

**Authentication**
- Register / login / logout flow
- Enter key navigates between fields, submits on the last one
- Profile name update from Settings

**Transactions**
- Add, edit, and delete income/expense entries
- Auto-filled current date (IST) on new entries
- Live search and type filter (income / expense / all)
- Table auto-hides its header when there's no data

**Dashboard**
- Real-time summary cards — balance, total income, total expense, transaction count
- Cash flow line chart (Chart.js) plotting income vs. expense over time
- One-click "Reset All Data"

**UI / UX**
- Light & dark mode — toggle-controlled, defaults to light, persists across reloads
- Responsive sidebar with mobile overlay, auto-closes on any sidebar action
- Modal system with backdrop — background clicks are blocked and close the active modal

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Markup     | HTML5                                |
| Styling    | Tailwind CSS v4 (Browser CDN build)  |
| Logic      | Vanilla JavaScript (ES6+, DOM APIs)  |
| Charts     | Chart.js                             |
| Icons      | Lucide (inline SVG)                  |
| Font       | Inter (Google Fonts)                 |
| Storage    | Browser `localStorage`               |

## Project Structure

```
├── index.html      # Markup + Tailwind classes
├── script.js       # All application logic
└── README.md
```

## How It Works

- **No backend** — this is a single-account, browser-only app. All data (credentials, transactions, theme, preferences) lives in `localStorage` on the user's device.
- Registering a new account clears any previous session's transactions, since the app supports one active account at a time.
- Dark mode uses Tailwind's `class` strategy (`@custom-variant dark`) so it's toggle-controlled instead of following the OS setting.

## Getting Started

No build step required.

1. Clone or download the project
2. Open `index.html` in a browser

That's it.

## Known Limitations

- Single-user only — no multi-account or cross-device sync
- No real backend, so passwords are stored in plain text in `localStorage` (fine for a learning project, not for production)
- Currency selector in Settings is currently UI-only

## Roadmap Ideas

- Category-wise spending breakdown (pie/bar chart)
- Export transactions as CSV/PDF
- Multi-currency support with live conversion
- Backend + database for real multi-user support
