import { Request, Response } from 'express';
import { RestaurantService } from '../services/restaurant.service.js';
import { Types } from 'mongoose';

export class RestaurantController {


   static async getRestaurants(req: any, res: any): Promise<void> {

      try {
         const restaurants = await RestaurantService.getRestaurants(req.user?.tenantId);

         res.status(200).json({
            success: true,
            message: 'Restaurants fetched successfully',
            restaurants,
         });

      } catch (error: any) {
         res.status(500).json({ message: error.message || 'Restaurants not found' });
      }
   }

   static async getRestaurantById(req: any, res: any) {
      

      try {

         const restaurantId = req.params.id;
         if(!Types.ObjectId.isValid(restaurantId)) {
            res.status(400).json({
               success: false,
               message: 'Invalid restaurantId',
            });
            return;
         }

         const restaurant = await RestaurantService.getRestaurantById(req.user?.tenantId, restaurantId);

         if (!restaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
            return;
         }

         res.status(200).json({
            success: true,
            message: 'Restaurant fetched successfully',
            restaurant,
         });

      } catch (error: any) {
         res.status(500).json({ message: error.message || 'Failed to fetch restaurant by ID' });
      }

   }

   static async createRestaurant(req: Request, res: Response): Promise<void> {
      try {
         const {name, description, brandName, gstNumber, logoUrl} = req.body;
         const tenantId: string | undefined = req.user?.tenantId;
         if (!tenantId || !name || !description) {
            res.status(400).json({
               success: false,
               message: 'tenantId, name, and description are required',
            });
            return;
         }

         if(!Types.ObjectId.isValid(tenantId)) {
            res.status(400).json({
               success: false,
               message: 'Invalid tenantId',
            });
            return;
         }

         const restaurant = await RestaurantService.createRestaurant(
            tenantId,
            name,
            description,
            brandName,
            gstNumber,  
            logoUrl
         );

         res.status(200).json({
            sucess: true,
            message: 'Restaurant created successfully',
            restaurant: {
               _id: restaurant._id,
               tenantId: restaurant.tenantId,
               name: restaurant.name,
               description: restaurant.description,
            },
         });
      } catch (error) {
         res.status(500).json({ message: 'Internal server error' });
      }
   }

   static async updateRestaurant(req: any, res: any): Promise<void> {
      try {

         const { name, description, brandName, gstNumber, logoUrl } = req.body;
         const id = req.params.id;

         const tenantId: string | undefined = req.user?.tenantId;
         if (!tenantId || !id || !name || !description) {
            res.status(400).json({
               success: false,
               message: 'tenantId, id, name, and description are required',
            });
            return;
         }

         if(!Types.ObjectId.isValid(tenantId)) {
            res.status(400).json({
               success: false,
               message: 'Invalid tenantId or Invalid restaurantId',
            });
            return;
         }

         if(!Types.ObjectId.isValid(id)) {
            res.status(400).json({
               success: false,
               message: 'Invalid restaurantId',
            });
            return;
         }

         const restaurant = await RestaurantService.updateRestaurant(
            tenantId,
            id,
            name,
            description,
            brandName,
            gstNumber,
            logoUrl
         );

         if (!restaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
            return;
         }

         res.status(200).json({
            success: true,
            message: 'Restaurant updated successfully',
            restaurant,
         });

      } catch (error: any) {
         res.status(500).json({ message: error.message || 'Failed to update restaurant' });
      }
   }


   static deleteRestaurant(req: any, res: any) {
      res.status(200).json({ message: 'Restaurant deleted successfully' });
   }
}
