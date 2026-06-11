import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../service/dashboardService";

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: getDashboardMetrics,
    refetchInterval: 30000, // auto-refresh metrics every 30 seconds
  });
};
