import { SimulatorProvider } from "./simulator-provider.interface.js";

export class WebsiteSimulator implements SimulatorProvider {
  provider = "WEBSITE";

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
        menuItemId: it.externalItemId,
        name: it.name,
        quantity,
        price: itemPrice,
        variantId: it.externalVariantId || undefined,
        addons: addons.length > 0 ? addons : undefined,
      };
    });

    const payload: any = {
      orderId: args.orderId,
      outletId: args.outletId, // Uses standard outlet ID for Website
      customer: {
        name: "Website Customer",
        phone: "9876543223",
        email: "website-guest@example.com",
      },
      fulfillment: {
        type: "DELIVERY",
        address: {
          line1: "456 Online Ave",
          line2: "Apt 4B",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
        },
      },
      payment: {
        mode: args.paymentMode === "CASH" ? "CASH" : "ONLINE",
        status: args.paymentMode === "CASH" ? "PENDING" : "PAID",
        transactionId: args.paymentMode !== "CASH" ? `TXN-WEB-${args.orderId}` : undefined,
      },
      pricing: {
        subtotal,
        tax: 0,
        deliveryFee: 0,
        discount: 0,
        totalAmount: subtotal,
      },
      items: itemsFormatted,
      notes: "Deliver before sunset",
    };

    if (args.chaos) {
      payload._chaosMode = args.chaos;
    }

    return payload;
  }
}
