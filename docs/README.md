# Nour Candle Studio: Order Desk

**Full name:** [Rabab Ali Faour]

**Branch:** `assignment-4-nour-order-desk`

## Project summary
A small order desk for Nour's handmade candle business. The dashboard lets
Nour add, view, edit, change the status of, and delete candle orders. The
dashboard calls a REST API built with Next.js Route Handlers. The business
rules (validation, server-calculated total, default `Pending` status,
server-owned IDs) are enforced on the server.

## Install and run
```bash
git clone [https://github.com/RababFaour/nour-order-desk]
cd [nour-order-desk]
git switch assignment-4-nour-order-desk
npm install
npm run dev
```
Open http://localhost:3000/dashboard

Other scripts:
```bash
npm run lint
npm run build
```

## Storage limitations
Orders are stored **in memory** in a global array (`globalThis.orderStore`
in `lib/orders.ts`). There is no file or database. Orders exist only while
the server process is running, and they are lost when the server stops.
They survive hot reloads during development.

Note: if `npm run dev` says "You can access the existing server", an old
server process is still running and still holds the old orders. Stop it
with `taskkill /PID <21960> /F` first.

## Documents
- [Plan](docs/PLAN.md)
- [API](docs/API.md)
- [Testing](docs/TESTING.md)
- [Review](docs/REVIEW.md)
- [Evidence](docs/evidence/)
