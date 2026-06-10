import { Router } from "express";
import authRoutes from "./auth.routes.js";
import subscriptionRoutes from "./subscription.routes.js";
import outletRoutes from "./outlet.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/outlets", outletRoutes);

export default router;
