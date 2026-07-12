# Guest Ordering Architecture

## Overview

OmniServe's Guest Ordering system enables restaurant diners to scan a QR code at their table and complete the entire ordering journey — from browsing the menu to settling the bill — entirely on their phone without downloading an app.

## System Layers

```
Guest's Phone
     │
     ▼
QR Code Scan (tableToken)
     │
     ▼
┌─────────────────────────────────────────────┐
│          Public API Layer                    │
│  /api/public/* (No auth required)            │
│  public.routes.ts → public.controller.ts     │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│       Order Gateway Pipeline                 │
│  OrderGatewayService.ingestExternalOrder()   │
│  OrderGatewayService.processExternalOrder()  │
│  QrAdapter.normalizeOrder()                  │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│       Canonical Order (MongoDB)              │
│  ExternalOrder → Order + OrderItems          │
│  Linked to QRSession via order.sessionId     │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│       Billing Pipeline                       │
│  BillingService.requestBill()                │
│  BillingService.settleBill()                 │
│  BillSession (aggregates all table orders)   │
└─────────────────────────────────────────────┘
```

## Key Models

| Model | Purpose |
|---|---|
| `Table` | Physical restaurant table with `qrToken` |
| `QRSession` | Active dining session for a table (OPEN → ORDERED → PAID → CLOSED) |
| `GuestSession` | Individual guest joined at the table |
| `Cart` | Guest's in-progress item selection |
| `ExternalOrder` | Raw ingested order before normalization |
| `Order` | Canonical internal order (linked to `sessionId`) |
| `BillSession` | Consolidated bill for all orders in a QRSession |
| `Payment` | Individual payment transaction |
| `WaiterTask` | Assistance request dispatched to a waiter |
| `ReviewAnalytics` | Guest feedback and star rating |

## Guest Journey State Machine

```
Table AVAILABLE
    │ (QR Scan)
    ▼
Table OCCUPIED + QRSession OPEN
    │ (Guest joins)
    ▼
GuestSession ACTIVE
    │ (Browse menu, add to cart)
    ▼
Cart ACTIVE
    │ (Place QR order via POST /api/public/qr/orders)
    ▼
ExternalOrder(QR) → Order(PLACED) + QRSession ORDERED
    │ (Kitchen accepts order)
    ▼
Order ACCEPTED → PREPARING → READY → SERVED
    │ (Guest requests bill)
    ▼
BillSession OPEN → PARTIAL_PAYMENT / SETTLED
    │ (Table cleared)
    ▼
Table CLEANING → AVAILABLE + QRSession PAID/CLOSED
```

## Security Model

- **No authentication required** for all `/api/public/*` routes
- All requests are scoped by `tableToken` (opaque, cryptographically random token)
- `guestSessionToken` is issued per guest per table visit
- Session tokens expire when the `QRSession` closes
- Rate limiting applied globally: 100 requests / 15 min per IP

## Multi-Guest Support

Multiple guests can join the same table simultaneously:
- Each guest receives a unique `guestSessionToken`
- All guests share the same `QRSession`
- Split billing tracks each guest's share via `BillSession.splits[]`
- `GET /api/public/qr/session/:sessionToken/guests` returns all active guests

## Technology Stack

- **Backend**: Node.js + TypeScript + Express 5
- **Database**: MongoDB via Mongoose
- **Real-time**: Socket.IO
- **Integration**: Adapter pattern via `OrderGatewayService`
- **Events**: Internal `EventBusService` for cross-module decoupling
