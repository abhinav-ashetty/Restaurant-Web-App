import { Router } from "express";
import { getFeaturedRestaurants, getRestaurantBySlug, getRestaurants , getRestaurantAvailibility } from "../controllers/restaurantController.js";

const restaurantRouter = Router();

restaurantRouter.get('/',getRestaurants);
restaurantRouter.get('/featured',getFeaturedRestaurants);
restaurantRouter.get('/:slug',getRestaurantBySlug);
restaurantRouter.get('/:id/availability',getRestaurantAvailibility);

export default restaurantRouter;
