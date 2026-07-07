import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/enums.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export const requireSystemAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    ApiResponseHandler.unauthorized(res, 'User not authenticated');
    return;
  }

  if (req.user.role !== UserRole.SYSTEM_ADMIN) {
    ApiResponseHandler.forbidden(res, 'Access denied. System Admin role required.');
    return;
  }

  next();
};
