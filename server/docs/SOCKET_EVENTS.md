# Socket Events Reference

## Overview

OmniServe uses Socket.IO for all real-time communication. The server is initialized via `RealtimeService.initialize(httpServer)`.

## Connection & Rooms

### Room Naming Conventions

| Room | Pattern | Who Joins |
|---|---|---|
| Outlet Operations | `outlet:{outletId}` | Staff, KDS, Operations Cockpit, Waiter Console |
| Guest Table Session | `session:{sessionToken}` | Guest devices |
| Tenant Admin | `tenant:{tenantId}` | Admin dashboards |

### Authentication
Staff connections authenticate via a JWT token passed as `socket.handshake.auth.token`.  
Guest connections join rooms via their `sessionToken` after joining the session.

---

## Server → Client Events

### Order Events

| Event | Room | Payload |
|---|---|---|
| `order:new` | `outlet:{outletId}` | `{ order, items }` |
| `order:status:updated` | `outlet:{outletId}`, `session:{sessionToken}` | `{ orderId, status, updatedAt, estimatedReadyAt }` |
| `order:accepted` | `outlet:{outletId}` | `{ orderId, acceptedAt }` |
| `order:preparing` | `outlet:{outletId}` | `{ orderId }` |
| `order:ready` | `outlet:{outletId}` | `{ orderId }` |
| `order:served` | `outlet:{outletId}` | `{ orderId }` |
| `order:completed` | `outlet:{outletId}` | `{ orderId }` |
| `order:cancelled` | `outlet:{outletId}` | `{ orderId, reason }` |

### Waiter Task Events

| Event | Room | Payload |
|---|---|---|
| `waiter:task:new` | `outlet:{outletId}`, `session:{sessionToken}` | `{ taskId, action, tableNumber, seatNumber }` |
| `waiter:task:assigned` | `outlet:{outletId}`, `session:{sessionToken}` | `{ taskId, waiterId, waiterName }` |
| `waiter:task:completed` | `outlet:{outletId}`, `session:{sessionToken}` | `{ taskId, completedAt }` |
| `waiter:task:escalated` | `outlet:{outletId}` | `{ taskId, reason }` |

### Billing Events

| Event | Room | Payload |
|---|---|---|
| `bill:requested` | `outlet:{outletId}`, `session:{sessionToken}` | `{ billSessionId, totalAmount }` |
| `bill:settled` | `outlet:{outletId}`, `session:{sessionToken}` | `{ billSessionId, settledAt, totalSettled }` |
| `bill:split:updated` | `session:{sessionToken}` | `{ splits, outstandingBalance }` |

### KDS Events

| Event | Room | Payload |
|---|---|---|
| `kds:order:new` | `outlet:{outletId}` | `{ orderId, items, tableNumber, source }` |
| `kds:order:bump` | `outlet:{outletId}` | `{ orderId, status }` |

### Reservation Events

| Event | Room | Payload |
|---|---|---|
| `reservation:confirmed` | `outlet:{outletId}` | `{ reservationId, guestName, tableId }` |
| `reservation:cancelled` | `outlet:{outletId}` | `{ reservationId }` |
| `reservation:seated` | `outlet:{outletId}` | `{ reservationId, tableId }` |

### Floor Management Events

| Event | Room | Payload |
|---|---|---|
| `floor:table:status` | `outlet:{outletId}` | `{ tableId, operationalStatus }` |
| `floor:session:opened` | `outlet:{outletId}` | `{ sessionId, tableId }` |
| `floor:session:closed` | `outlet:{outletId}` | `{ sessionId, tableId }` |

### Analytics & Notification Events

| Event | Room | Payload |
|---|---|---|
| `notification:new` | `tenant:{tenantId}` | `{ notificationId, type, message }` |
| `analytics:realtime` | `tenant:{tenantId}` | `{ metric, value, timestamp }` |

---

## Client → Server Events

| Event | Purpose | Payload |
|---|---|---|
| `join:outlet` | Staff joins outlet room | `{ outletId, token }` |
| `join:session` | Guest joins table session room | `{ sessionToken }` |
| `leave:session` | Guest leaves table session room | `{ sessionToken }` |
| `ping` | Keep-alive heartbeat | — |

---

## Real-time Sync Worker

The `realtime-sync.worker.ts` job polls the database for state changes and broadcasts them via socket. It handles:

1. **Order status propagation** — Any order status change emits `order:status:updated` to both the outlet room AND the guest's session room
2. **Waiter task lifecycle** — Task assignments and completions are broadcast to `session:{sessionToken}` so guests can see their request status in real time
3. **Bill settlement** — Bill state changes are pushed to both the outlet and the guest session

## Important Notes

- Guests only receive events scoped to their `session:{sessionToken}` room
- Staff only receive events scoped to their `outlet:{outletId}` room
- No cross-outlet or cross-tenant socket leakage is possible by design
- All socket connections gracefully handle reconnection — missed events are fetched via HTTP polling on reconnect
