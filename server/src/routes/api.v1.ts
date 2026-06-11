import { Router } from "express";

import authRoutes from "./auth.route.js";
import subscriptionRoutes from "./subscription.route.js";
import restaurantRouter from "./restaurant.route.js";
import outletRoutes from "./outlet.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/restaurants", restaurantRouter);
router.use("/outlets", outletRoutes);

export default router;