# Billing Flow

## Overview

OmniServe uses a **postpaid** billing model for QR dine-in. The bill is generated at the end of the dining session, aggregating all orders placed during that session.

## Models

### BillSession

```typescript
{
  tenantId: ObjectId,
  outletId: ObjectId,
  sessionId: ObjectId,         // → QRSession._id
  tableId: ObjectId,
  orderIds: ObjectId[],        // All orders in this session
  totalAmount: number,
  outstandingBalance: number,
  status: "OPEN" | "PARTIAL_PAYMENT" | "SETTLED",
  splits: [{
    seatNumber: string,
    guestName?: string,
    amount: number,
    isPaid: boolean,
    paymentId?: ObjectId
  }],
  settledAt?: Date
}
```

### Payment

```typescript
{
  tenantId: ObjectId,
  orderId: ObjectId,
  transactionId: string,       // Unique per payment
  paymentMethod: "CASH" | "UPI" | "CARD" | "ONLINE" | "RAZORPAY" | "STRIPE",
  amount: number,
  currency: "INR",
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED",
  razorpayOrderId?: string,
  razorpayPaymentId?: string,
  stripeSessionId?: string
}
```

## Bill Request Flow

```
Guest places order(s) via POST /api/public/qr/orders
        │
        ▼
Order created, Order.sessionId = QRSession._id

Guest requests bill via GET /api/public/qr/session/:sessionToken/bill
        │
        ▼
BillingService.requestBill(sessionId, tenantId)
        │
        ├── Queries all Orders where sessionId = session._id
        ├── Calculates totalAmount = Σ(order.totalAmount)
        ├── Creates or updates BillSession
        │      { orderIds, totalAmount, status: "OPEN" }
        └── Returns BillSession with line items breakdown
```

## Payment Settlement Flow

```
POST /api/public/qr/session/:sessionToken/bill/pay
Body: { paymentMode, tip, seatNumber? }
        │
        ▼
BillingService.settleBill(sessionId, options)
        │
        ├── [FULL] No seatNumber provided:
        │     ├── BillSession.status = "SETTLED"
        │     ├── BillSession.outstandingBalance = 0
        │     ├── Creates Payment record for each order
        │     └── All splits.isPaid = true
        │
        ├── [BY_SEAT] seatNumber provided:
        │     ├── Finds matching split in BillSession.splits[]
        │     ├── split.isPaid = true
        │     ├── Creates Payment record for that split amount
        │     ├── Recalculates outstandingBalance
        │     └── If all splits paid → status = "SETTLED"
        │
        └── [POST-SETTLEMENT]
              ├── QRSession.status = "PAID"
              ├── Table.operationalStatus = "CLEANING"
              ├── Table.activeSessionId unset
              └── OrderTimeline entry "BILL_SETTLED" created
```

## Split Billing Strategies

### EQUAL Split
Total amount divided equally among all active guests.

```
POST /api/public/qr/session/:sessionToken/bill/split
Body: { strategy: "EQUAL" }
```

### BY_SEAT Split
Each guest pays for what their seat ordered (based on `seatNumber` on items).

```
POST /api/public/qr/session/:sessionToken/bill/split
Body: { strategy: "BY_SEAT" }
```

### CUSTOM Split
Manually specified amounts per guest.

```
POST /api/public/qr/session/:sessionToken/bill/split
Body: {
  strategy: "CUSTOM",
  splits: [
    { seatNumber: "1", amount: 350 },
    { seatNumber: "2", amount: 250 }
  ]
}
```

## Payment Gateway Integration

| Method | Gateway | Flow |
|---|---|---|
| `CASH` | None | Marked SUCCESS immediately |
| `UPI` | Internal QR | UPI deep-link generated |
| `CARD` | Razorpay/Stripe | Redirect to payment gateway |
| `RAZORPAY` | Razorpay | `razorpayOrderId` returned for SDK |
| `STRIPE` | Stripe | `stripeSessionId` returned for redirect |

## Important Rules

1. **Backend is source of truth** — All totals come from the database; never trust frontend calculations for final amounts
2. **One BillSession per QRSession** — Never create duplicate BillSessions for the same session
3. **Idempotent payment recording** — Transaction ID uniqueness prevents double-charging
4. **Tax is computed server-side** — Tax rates are configured per outlet; guests cannot influence them
5. **Tips are optional** — Added on top of `totalAmount` and recorded separately

## Error Handling

| Error | HTTP | Cause |
|---|---|---|
| `No orders found for this session` | 400 | Bill requested before any order placed |
| `Bill already settled` | 400 | Attempting to pay an already-settled bill |
| `Invalid split: amounts don't sum to total` | 400 | Custom split math is wrong |
| `No split found for seat X` | 400 | Trying to pay for a seat that doesn't exist |
| `Payment gateway error` | 500 | External gateway failure; retry safe |
