import { Request, Response } from 'express';
import { HealthService } from './health.service.js';

export class HealthController {
  /**
   * Public health check (No auth)
   * Returns only overall status, timestamp, and uptime.
   * HTTP 200 for OK/Degraded, HTTP 503 for Down.
   */
  static async getPublicHealth(req: Request, res: Response): Promise<void> {
    try {
      const result = await HealthService.runChecks(false); // Always shallow for public
      
      const responseBody = {
        status: result.status,
        timestamp: result.timestamp,
        uptime: result.uptime,
      };

      const statusCode = result.status === 'down' ? 503 : 200;
      res.status(statusCode).json(responseBody);
    } catch (error: any) {
      res.status(503).json({
        status: 'down',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    }
  }

  /**
   * Detailed health check (System Admin only)
   * Supports ?deep=true to run write/delete tests.
   * HTTP 200 for OK/Degraded, HTTP 503 for Down.
   */
  static async getDetailedHealth(req: Request, res: Response): Promise<void> {
    try {
      const deep = req.query.deep === 'true';
      const result = await HealthService.runChecks(deep);

      const statusCode = result.status === 'down' ? 503 : 200;
      res.status(statusCode).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Detailed health check execution failed',
      });
    }
  }
}
