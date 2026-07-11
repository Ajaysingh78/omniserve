import express, { Router } from "express";
import { CouponController } from "./coupon.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { requireSystemAdmin } from "../../middlewares/rbac.middleware.js";

const couponRouter: Router = express.Router();

// All CRUD coupon routes are restricted to System Admins only
couponRouter.use(verifyToken, requireSystemAdmin);

couponRouter.get("/", CouponController.listCoupons);
couponRouter.post("/", CouponController.createCoupon);
couponRouter.get("/:id", CouponController.getCouponById);
couponRouter.put("/:id", CouponController.updateCoupon);
couponRouter.delete("/:id", CouponController.deleteCoupon);

export default couponRouter;
