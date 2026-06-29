export interface SimulatorProvider {
  provider: string;
  generatePayload(args: {
    tenantId: string;
    outletId: string;
    externalOutletId: string;
    items: Array<{
      externalItemId: string;
      externalVariantId?: string | undefined;
      externalAddonId?: string | undefined;
      price: number;
      name: string;
      quantity: number;
      variantName?: string | undefined;
      addonName?: string | undefined;
      addonPrice?: number | undefined;
    }>;
    paymentMode: string;
    chaos?: string | undefined;
    orderId: string;
  }): any;
}
