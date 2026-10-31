# Plan

## Client problem
Nour sells handmade candles and tracks orders by hand. She needs one screen
to add orders, see their status, correct mistakes, and remove accidental
orders, with totals she can trust.

## Required features
- List all orders and show counts (total, Pending, Preparing, Delivered)
- Add an order (customer name, phone, candle, quantity)
- Edit an order and change its status
- Delete an order
- Server calculates the total (quantity x unit price, max 2 decimals)
- New orders always start as `Pending`
- Server rejects invalid input with clear errors

## Endpoint list
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/:id` | Read one order |
| PATCH | `/api/orders/:id` | Update some fields of an order |
| DELETE | `/api/orders/:id` | Delete an order |

## Implementation steps
1. Create the working branch `assignment-4-nour-order-desk`.
2. Put the order type, validation and total calculation in `lib/orders.ts`.
3. Build the Route Handlers in `app/api/orders/route.ts` and
   `app/api/orders/[id]/route.ts`.
4. Build the dashboard (`OrdersDashboard`, `OrderForm`, `OrderTable`) that
   calls the API with `fetch` for all CRUD operations.
5. Test every endpoint, including invalid input and unknown IDs, in
   Thunder Client.
6. Fix problems found by the tests and retest.
7. Write the documents and record the evidence.