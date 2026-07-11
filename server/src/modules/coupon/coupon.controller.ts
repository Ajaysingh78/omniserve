import { Request, Response } from "express";
import { CouponService } from "./coupon.service.js";
import { ApiResponseHandler } from "../../utils/apiResponse.js";

export class CouponController {
  /**
   * Create a new Coupon (System Admin Only)
   * POST /coupons
   */
  static async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      const {
        code,
        discountType,
        discountValue,
        minAmount,
        minOrderAmount,
        maxDiscountAmount,
        expirationDate,
        isActive,
      } = req.body;

      if (!code || !discountType || discountValue === undefined) {
        ApiResponseHandler.badRequest(res, "code, discountType, and discountValue are required");
        return;
      }

      if (discountType !== "PERCENTAGE" && discountType !== "FLAT") {
        ApiResponseHandler.badRequest(res, "discountType must be PERCENTAGE or FLAT");
        return;
      }

      if (isNaN(Number(discountValue)) || Number(discountValue) < 0) {
        ApiResponseHandler.badRequest(res, "discountValue must be a positive number");
        return;
      }

      const resolvedMinAmount = minAmount !== undefined ? minAmount : minOrderAmount;

      const coupon = await CouponService.createCoupon(
        {
          code,
          discountType,
          discountValue,
          minAmount: resolvedMinAmount,
          maxDiscountAmount,
          expirationDate,
          isActive,
        },
        req.user?.userId
      );

      ApiResponseHandler.success(res, 201, "Coupon created successfully", coupon);
    } catch (error: any) {
      ApiResponseHandler.badRequest(res, error.message || "Failed to create coupon");
    }
  }

  /**
   * List coupons (System Admin Only)
   * GET /coupons
   */
  static async listCoupons(req: Request, res: Response): Promise<void> {
    try {
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;

      const coupons = await CouponService.getCoupons({ isActive });
      ApiResponseHandler.success(res, 200, "Coupons retrieved successfully", coupons);
    } catch (error: any) {
      ApiResponseHandler.badRequest(res, error.message || "Failed to list coupons");
    }
  }

  /**
   * Get coupon details (System Admin Only)
   * GET /coupons/:id
   */
  static async getCouponById(req: Request, res: Response): Promise<void> {
    try {
      const coupon = await CouponService.getCouponById(req.params.id as string);
      if (!coupon) {
        ApiResponseHandler.notFound(res, "Coupon not found");
        return;
      }

      ApiResponseHandler.success(res, 200, "Coupon retrieved successfully", coupon);
    } catch (error: any) {
      ApiResponseHandler.badRequest(res, error.message || "Failed to get coupon details");
    }
  }

  /**
   * Update coupon details (System Admin Only)
   * PUT /coupons/:id
   */
  static async updateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { minAmount, minOrderAmount } = req.body;
      const data = { ...req.body };
      if (minAmount !== undefined) {
        data.minAmount = minAmount;
      } else if (minOrderAmount !== undefined) {
        data.minAmount = minOrderAmount;
      }

      const coupon = await CouponService.updateCoupon(
        req.params.id as string,
        data,
        req.user?.userId as string
      );

      if (!coupon) {
        ApiResponseHandler.notFound(res, "Coupon not found");
        return;
      }

      ApiResponseHandler.success(res, 200, "Coupon updated successfully", coupon);
    } catch (error: any) {
      ApiResponseHandler.badRequest(res, error.message || "Failed to update coupon");
    }
  }

  /**
   * Delete a coupon (System Admin Only)
   * DELETE /coupons/:id
   */
  static async deleteCoupon(req: Request, res: Response): Promise<void> {
    try {
      const coupon = await CouponService.deleteCoupon(
        req.params.id as string,
        req.user?.userId as string
      );
      if (!coupon) {
        ApiResponseHandler.notFound(res, "Coupon not found");
        return;
      }

      ApiResponseHandler.success(res, 200, "Coupon deleted successfully", coupon);
    } catch (error: any) {
      ApiResponseHandler.badRequest(res, error.message || "Failed to delete coupon");
    }
  }
}
