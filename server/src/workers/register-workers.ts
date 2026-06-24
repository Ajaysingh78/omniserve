import { workerRegistry } from "../services/sync-engine.service.js";
import { statusSyncWorker } from "./status-sync.worker.js";
import { inventorySyncWorker } from "./inventory-sync.worker.js";
import { menuSyncWorker } from "./menu-sync.worker.js";

export function initWorkerRegistry(): void {
  workerRegistry.register("ORDER_CREATED", statusSyncWorker);
  workerRegistry.register("ORDER_STATUS_CHANGED", statusSyncWorker);
  workerRegistry.register("INVENTORY_CHANGED", inventorySyncWorker);
  workerRegistry.register("MENU_CHANGED", menuSyncWorker);
}
