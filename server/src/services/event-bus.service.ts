import { Types } from "mongoose";
import IntegrationEventQueue, { IIntegrationEventQueue } from "../models/integration-event-queue.model.js";

export interface PublishOptions {
  correlationId?: string | undefined;
  causationId?: string | null | undefined;
  createdBy?: string | Types.ObjectId | undefined;
  sourceSystem?: string | undefined;
  eventVersion?: number | undefined;
  schemaVersion?: number | undefined;
}

export class EventBusService {
  /**
   * Helper to write a new event to the integration event outbox queue.
   * Handles deduplication gracefully by catching MongoDB unique index errors.
   */
  private static async createEvent(
    tenantId: string | Types.ObjectId,
    outletId: string | Types.ObjectId | null,
    eventType: string,
    aggregateType: string,
    aggregateId: string | Types.ObjectId,
    payload: unknown,
    options: PublishOptions = {}
  ): Promise<IIntegrationEventQueue | null> {
    const correlationId = options.correlationId || new Types.ObjectId().toString();
    const createdBy = options.createdBy ? new Types.ObjectId(options.createdBy) : null;
    const sourceSystem = options.sourceSystem || "SYSTEM";
    const eventVersion = options.eventVersion || 1;
    const schemaVersion = options.schemaVersion || 1;

    try {
      const event = new IntegrationEventQueue({
        tenantId: new Types.ObjectId(tenantId),
        outletId: outletId ? new Types.ObjectId(outletId) : null,
        eventType,
        aggregateType,
        aggregateId: new Types.ObjectId(aggregateId),
        payload,
        status: "PENDING",
        correlationId,
        causationId: options.causationId || null,
        eventVersion,
        schemaVersion,
        createdBy,
        sourceSystem,
        queuedAt: new Date(),
        retryCount: 0,
        maxRetryCount: 3,
        nextRetryAt: null,
      });

      return await event.save();
    } catch (error: any) {
      // Catch MongoDB unique index/duplicate key error (code 11000)
      if (error.code === 11000) {
        console.warn(
          `[EventBusService] Deduplicated duplicate event creation. eventType=${eventType}, aggregateId=${aggregateId}, correlationId=${correlationId}, version=${eventVersion}`
        );
        // Find and return the existing duplicate event
        const existing = await IntegrationEventQueue.findOne({
          tenantId: new Types.ObjectId(tenantId),
          eventType,
          aggregateId: new Types.ObjectId(aggregateId),
          correlationId,
          eventVersion,
        });
        return existing;
      }
      throw error;
    }
  }

  static async publishOrderCreated(
    tenantId: string | Types.ObjectId,
    outletId: string | Types.ObjectId | null,
    orderId: string | Types.ObjectId,
    payload: unknown,
    options?: PublishOptions
  ): Promise<IIntegrationEventQueue | null> {
    return this.createEvent(
      tenantId,
      outletId,
      "ORDER_CREATED",
      "ORDER",
      orderId,
      payload,
      options
    );
  }

  static async publishOrderStatusChanged(
    tenantId: string | Types.ObjectId,
    outletId: string | Types.ObjectId | null,
    orderId: string | Types.ObjectId,
    payload: unknown,
    options?: PublishOptions
  ): Promise<IIntegrationEventQueue | null> {
    return this.createEvent(
      tenantId,
      outletId,
      "ORDER_STATUS_CHANGED",
      "ORDER",
      orderId,
      payload,
      options
    );
  }

  static async publishInventoryChanged(
    tenantId: string | Types.ObjectId,
    outletId: string | Types.ObjectId | null,
    inventoryId: string | Types.ObjectId,
    payload: unknown,
    options?: PublishOptions
  ): Promise<IIntegrationEventQueue | null> {
    return this.createEvent(
      tenantId,
      outletId,
      "INVENTORY_CHANGED",
      "INVENTORY",
      inventoryId,
      payload,
      options
    );
  }

  static async publishMenuChanged(
    tenantId: string | Types.ObjectId,
    outletId: string | Types.ObjectId | null,
    aggregateId: string | Types.ObjectId,
    aggregateType: "MENU_ITEM", // Or others depending on catalog structure
    payload: unknown,
    options?: PublishOptions
  ): Promise<IIntegrationEventQueue | null> {
    return this.createEvent(
      tenantId,
      outletId,
      "MENU_CHANGED",
      aggregateType,
      aggregateId,
      payload,
      options
    );
  }

  static async publishCartCreated(
    tenantId: string | Types.ObjectId,
    outletId: string | Types.ObjectId | null,
    cartId: string | Types.ObjectId,
    payload: unknown,
    options?: PublishOptions
  ): Promise<IIntegrationEventQueue | null> {
    return this.createEvent(
      tenantId,
      outletId,
      "CART_CREATED",
      "CART",
      cartId,
      payload,
      options
    );
  }

  static async publishCartUpdated(
    tenantId: string | Types.ObjectId,
    outletId: string | Types.ObjectId | null,
    cartId: string | Types.ObjectId,
    payload: unknown,
    options?: PublishOptions
  ): Promise<IIntegrationEventQueue | null> {
    return this.createEvent(
      tenantId,
      outletId,
      "CART_UPDATED",
      "CART",
      cartId,
      payload,
      options
    );
  }

  static async publishCheckoutStarted(
    tenantId: string | Types.ObjectId,
    outletId: string | Types.ObjectId | null,
    cartId: string | Types.ObjectId,
    payload: unknown,
    options?: PublishOptions
  ): Promise<IIntegrationEventQueue | null> {
    return this.createEvent(
      tenantId,
      outletId,
      "CHECKOUT_STARTED",
      "CART",
      cartId,
      payload,
      options
    );
  }
}
