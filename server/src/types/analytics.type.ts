export interface IQueryAnalyticsDaily {
  outletId?: string;
  from?: string;
  to?: string;
}

export interface ICreateDailyAnalyticsInput {
  outletId: string;
  reportDate: string; // ISO date string (YYYY-MM-DD)
  totalOrders?: number;
  totalRevenue?: number;
  cancelledOrders?: number;
  newCustomers?: number;
  repeatCustomers?: number;
}
