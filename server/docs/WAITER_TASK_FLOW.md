# Waiter Task Flow

## Overview

Waiter Tasks are the real-time assistance requests raised by guests at their table. They appear instantly in the **Waiter Console** and trigger notifications to on-duty staff.

## Model: WaiterTask

```typescript
{
  tenantId: ObjectId,
  outletId: ObjectId,
  tableId: ObjectId,
  sessionId: ObjectId,         // → QRSession._id
  seatNumber?: string,
  action: WaiterTaskAction,    // Enum (see below)
  status: "PENDING" | "ASSIGNED" | "COMPLETED" | "ESCALATED",
  waiterId?: ObjectId,         // Assigned waiter
  notes?: string,
  requestedAt: Date,
  assignedAt?: Date,
  completedAt?: Date,
  escalatedAt?: Date,
  slaDueAt?: Date              // SLA deadline for escalation
}
```

## WaiterTaskAction Enum

| Value | Description |
|---|---|
| `NEED_WATER` | Bring water to the table |
| `CALL_WAITER` | Guest needs general assistance |
| `NEED_SPOON` | Bring cutlery |
| `NEED_TISSUE` | Bring tissue/napkins |
| `NEED_BILL` | Guest is ready to pay |
| `CLEANING_REQUIRED` | Table needs cleaning |
| `PLACE_ORDER` | Waiter to take order manually |
| `CUSTOM` | Custom request with notes |

## Flow Diagram

```
Guest taps assistance button in OrderTrackingPage.jsx
        │
        ▼
POST /api/public/qr/assist
Body: { tableToken, action, seatNumber, notes? }
        │
        ▼
PublicController.requestQrAssistance()
        │
        ├── Validates tableToken → Table record
        ├── Finds active QRSession for table
        ├── WaiterTaskService.createTask()
        │       WaiterTask { status: "PENDING", slaDueAt: now() + SLA_minutes }
        │
        ├── NotificationService.create()
        │       Notification pushed to all outlet staff
        │
        └── RealtimeService.emit("waiter:task:new", { taskId, action, tableNumber })
                → to room: outlet:{outletId}
                → to room: session:{sessionToken}   ← Guest sees "Request sent ✓"

Waiter opens Waiter Console
        │
        ▼
Waiter clicks "Accept Task"
        │
        ▼
POST /api/operations/waiter-tasks/:taskId/assign
Body: { waiterId }
        │
        ├── WaiterTask.status = "ASSIGNED"
        ├── WaiterTask.waiterId = waiterId
        ├── WaiterTask.assignedAt = now()
        └── Socket: "waiter:task:assigned" → outlet + session rooms

Waiter completes the task
        │
        ▼
POST /api/operations/waiter-tasks/:taskId/complete
        │
        ├── WaiterTask.status = "COMPLETED"
        ├── WaiterTask.completedAt = now()
        └── Socket: "waiter:task:completed" → outlet + session rooms
                ← Guest sees "Request fulfilled ✓"
```

## SLA Escalation

A background worker (`waiter-task-escalation.worker.ts`) runs every minute and checks for tasks that have exceeded their SLA deadline:

```
WaiterTask.slaDueAt < now() AND status = "PENDING"
        │
        ▼
WaiterTask.status = "ESCALATED"
WaiterTask.escalatedAt = now()
NotificationService → Manager notification
Socket: "waiter:task:escalated" → outlet room
```

SLA minutes are configured per-outlet in `Outlet.waiterTaskSlas`:
```json
{
  "NEED_WATER": 3,
  "NEED_BILL": 5,
  "CLEANING_REQUIRED": 10
}
```

## Guest Feedback Loop

The guest's `OrderTrackingPage.jsx` shows a live status panel for each assistance request:

| Request Status | UI Display |
|---|---|
| Sent | "⏳ Request sent..." |
| PENDING | "⏳ Waiting for waiter..." |
| ASSIGNED | "👋 Waiter on the way!" |
| COMPLETED | "✅ Done!" |

Status updates arrive via the `waiter:task:updated` socket event on the `session:{sessionToken}` room.

## Operations Cockpit Integration

All waiter tasks appear in the **Operations Cockpit** under the "Floor Activity" panel:
- Sorted by urgency (ESCALATED > PENDING > ASSIGNED)
- Colour-coded by action type
- Real-time count badge on the waiter console icon

## Key Endpoints

```
POST   /api/public/qr/assist                        Create guest assistance request
GET    /api/operations/waiter-tasks                 List all tasks for outlet
POST   /api/operations/waiter-tasks/:id/assign      Assign task to waiter
POST   /api/operations/waiter-tasks/:id/complete    Mark task completed
POST   /api/operations/waiter-tasks/:id/escalate    Manual escalation
```
