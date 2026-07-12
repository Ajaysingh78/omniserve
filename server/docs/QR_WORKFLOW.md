# QR Workflow

## End-to-End QR Dining Flow

### Step 1 — Table QR Code Generation
Every table in OmniServe has a unique `qrToken` stored in the `Table` model.  
The QR code encodes the URL: `{CLIENT_URL}/table/{tableToken}`

### Step 2 — Guest Scans QR Code
The client navigates to `QRRedirectPage.jsx`, which calls:
```
GET /api/public/qr/table/:tableToken
```
**Response:**
```json
{
  "sessionToken": "SESS-XXXX",         // QRSession token
  "guestSessionToken": "GST-XXXX",     // Individual guest token
  "tableNumber": "T-12",
  "outletId": "...",
  "restaurantName": "...",
  "estimatedPrepTime": 20
}
```
Both tokens are persisted in `localStorage`.

### Step 3 — Guest Profile Setup
```
PATCH /api/public/qr/session/guest
Header: x-guest-session-token: GST-XXXX
Body: { "name": "Riya", "phone": "9876543210", "seatNumber": "2" }
```

### Step 4 — Browse Menu
```
GET /api/public/menu?outletId=...&categoryId=...&search=...
```
Returns paginated menu items with categories, images, variants and addons.

### Step 5 — Cart Management
```
POST /api/public/cart
Body: { sessionToken, outletId, item: { menuItemId, quantity, variantId, addons } }

DELETE /api/public/cart/item
Body: { sessionToken, menuItemId }

GET /api/public/cart?sessionToken=...
```

### Step 6 — Place QR Order (Postpaid)
```
POST /api/public/qr/orders
Body: {
  tableToken, seatNumber, customer,
  items: [{ menuItemId, name, price, quantity, addons }],
  notes
}
```
This route ingests the order via `QrAdapter`, creates an `ExternalOrder` and `Order`, then links `order.sessionId = qrSession._id`.

### Step 7 — Live Order Tracking
The guest connects to the Socket.IO room `session:{sessionToken}`.  
All order status changes are pushed in real-time:
```
order:status:updated  →  { orderId, status, estimatedReadyAt }
waiter:task:updated   →  { taskId, action, status }
```

### Step 8 — Waiter Assistance
```
POST /api/public/qr/assist
Body: { tableToken, action: "NEED_WATER" | "CALL_WAITER" | "NEED_BILL" | ..., seatNumber }
```
Creates a `WaiterTask` visible in the Waiter Console and emits a socket notification.

### Step 9 — Bill Settlement (Postpaid)
```
GET /api/public/qr/session/:sessionToken/bill
POST /api/public/qr/session/:sessionToken/bill/pay
Body: { paymentMode: "UPI" | "CASH" | "CARD", tip }

POST /api/public/qr/session/:sessionToken/bill/split
Body: { strategy: "EQUAL" | "BY_SEAT" | "CUSTOM", splits }
```
`BillingService.requestBill()` aggregates all `Order` records linked to the `QRSession`.  
`BillingService.settleBill()` marks the `BillSession` as SETTLED and closes the session.

### Step 10 — Feedback
```
POST /api/public/qr/session/:sessionToken/feedback
Body: { rating: 1-5, reviewText }
```

### Step 11 — Leave Table
```
DELETE /api/public/qr/session/guest
Header: x-guest-session-token: GST-XXXX
```
Marks the `GuestSession` as INACTIVE. When all guests leave, the `QRSession` is closed.

## QR Session Lifecycle

```
Table.qrToken ──► resolveQrCode() ──► QRSession.create() (OPEN)
                                              │
                                    GuestSession.create() (ACTIVE)
                                              │
                                      ┌───────┴────────┐
                                      │    Multiple     │
                                      │    Guests       │
                                      └───────┬────────┘
                                              │ placeQrOrder()
                                              ▼
                                      QRSession (ORDERED)
                                              │ payQrSessionBill()
                                              ▼
                                      QRSession (PAID)
                                      BillSession (SETTLED)
                                      Table (CLEANING → AVAILABLE)
```

## Error States

| Error | Cause | Response |
|---|---|---|
| `Invalid or inactive Table Token` | Token expired or table deleted | 400 |
| `QR session expired` | Session auto-closed after inactivity | 400 |
| `Menu item is unavailable` | Item marked `isAvailable: false` | 400 |
| `No orders found for this session` | Bill requested before any order | 400 |
| `Bill already settled` | Attempting to re-pay | 400 |
