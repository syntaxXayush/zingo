import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { submitReview, getItemReviews, getOrderReviews } from "../controllers/review.controller.js";

const reviewRouter = express.Router();

// Submit a review
reviewRouter.post("/", isAuth, submitReview);
// Get all reviews for an item
reviewRouter.get("/item/:itemId", getItemReviews);
// Get all reviews for an order (by user)
reviewRouter.get("/order/:orderId", isAuth, getOrderReviews);

export default reviewRouter;
