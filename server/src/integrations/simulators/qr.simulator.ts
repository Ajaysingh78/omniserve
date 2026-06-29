import { SimulatorProvider } from "./simulator-provider.interface.js";

export class QrSimulator implements SimulatorProvider {
  provider = "QR";

  generatePayload(args: {
    tenantId: string;
    outletId: string;
    externalOutletId: string;
    items: any[];
    paymentMode: string;
    chaos?: string;
    orderId: string;
  }) {
    let subtotal = 0;
    const itemsFormatted = args.items.map((it) => {
      const itemPrice = it.price;
      const quantity = it.quantity || 1;
      let itemTotal = itemPrice;

      const addons: any[] = [];
      if (it.externalAddonId) {
        const addonPrice = it.addonPrice || 20;
        itemTotal += addonPrice;
        addons.push({
          addonId: it.externalAddonId,
          name: it.addonName || "Extra Addon",
          price: addonPrice,
        });
      }

      subtotal += itemTotal * quantity;

      return {
        itemId: it.externalItemId,
        name: it.name,
        quantity,
        price: itemPrice,
        variantId: it.externalVariantId || undefined,
        addons: addons.length > 0 ? addons : undefined,
      };
    });

    const payload: any = {
      orderId: args.orderId,
      outletId: args.outletId, // Uses standard outlet ID for QR
      customer: {
        name: "Table Guest",
        phone: "9876543224",
        email: "qr-table@example.com",
      },
      fulfillment: {
        tableNumber: "T-05",
        seatNumber: "1",
      },
      payment: {
        mode: args.paymentMode === "CASH" ? "CASH" : "ONLINE",
        status: args.paymentMode === "CASH" ? "PENDING" : "PAID",
        transactionId: args.paymentMode !== "CASH" ? `TXN-QR-${args.orderId}` : undefined,
      },
      pricing: {
        subtotal,
        tax: 0,
        deliveryFee: 0,
        discount: 0,
        totalAmount: subtotal,
      },
      items: itemsFormatted,
      notes: "Table side dine-in order",
    };

    if (args.chaos) {
      payload._chaosMode = args.chaos;
    }

    return payload;
  }
}
