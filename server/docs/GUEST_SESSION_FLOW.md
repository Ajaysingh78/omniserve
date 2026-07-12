# Guest Session Flow

## Model: GuestSession

```typescript
{
  tenantId: ObjectId,
  outletId: ObjectId,
  sessionId: ObjectId,        // → QRSession._id
  guestSessionToken: string,  // unique per guest visit
  name?: string,
  phone?: string,
  seatNumber?: string,
  status: "ACTIVE" | "LEFT" | "INACTIVE",
  joinedAt: Date,
  leftAt?: Date
}
```

## Flow Diagram

```
Guest scans QR
      │
      ▼
POST /api/public/qr/table/:tableToken
      │
      ├── Finds or creates QRSession for the table
      │       QRSession { status: "OPEN", sessionToken: "SESS-..." }
      │
      └── Creates GuestSession
              { guestSessionToken: "GST-...", status: "ACTIVE" }
              │
              ▼
         Returns both tokens to guest device
         Guest stores in localStorage

Guest updates profile
      │
      ▼
PATCH /api/public/qr/session/guest
Header: x-guest-session-token: GST-...
Body: { name, phone, seatNumber }
      │
      └── GuestSession updated with name/phone/seatNumber

Guest orders food
      │
      ▼
POST /api/public/qr/orders
Body: { tableToken, items, customer, seatNumber }
      │
      └── Order.sessionId = QRSession._id
          QRSession.status = "ORDERED"

Guest requests bill
      │
      ▼
GET /api/public/qr/session/:sessionToken/bill
      │
      └── BillingService.requestBill(sessionId)
          Aggregates all Order records with matching sessionId

Guest settles bill
      │
      ▼
POST /api/public/qr/session/:sessionToken/bill/pay
      │
      └── BillingService.settleBill()
          BillSession.status = "SETTLED"
          QRSession.status = "PAID"
          Table.operationalStatus = "CLEANING"

Guest leaves
      │
      ▼
DELETE /api/public/qr/session/guest
Header: x-guest-session-token: GST-...
      │
      └── GuestSession.status = "LEFT"
          GuestSession.leftAt = now()
          If all guests LEFT → QRSession.status = "CLOSED"
```

## Multi-Guest Scenarios

### Same Table, Multiple Guests

Each guest who scans gets their own `guestSessionToken`. All guests share:
- The same `QRSession`
- The same `BillSession`
- The same socket room (`session:{sessionToken}`)

### Guest Leaves Early

If one guest leaves before the bill is settled:
- Their `GuestSession.status` is set to `"LEFT"`
- The session remains `"ORDERED"` until all bills are settled
- Their split portion can still be settled by another guest

### Abandoned Sessions

If a table session is never explicitly closed:
- A background cleanup job marks sessions older than 8 hours as `"EXPIRED"`
- The table is automatically returned to `"AVAILABLE"` status

## Token Security

| Token | Scope | Lifetime | Storage |
|---|---|---|---|
| `sessionToken` | Entire table session | Until QRSession closes | localStorage |
| `guestSessionToken` | Individual guest | Until GuestSession closes | localStorage |
| `tableToken` | Permanent table identifier | Permanent | Embedded in QR code |

## Active Guests Endpoint

```
GET /api/public/qr/session/:sessionToken/guests
```

Returns all `ACTIVE` GuestSession records for the table:
```json
{
  "guests": [
    { "name": "Riya", "seatNumber": "1", "joinedAt": "..." },
    { "name": "Aman", "seatNumber": "2", "joinedAt": "..." }
  ],
  "count": 2
}
```
