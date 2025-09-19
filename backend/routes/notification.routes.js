import express from "express";
import { getNotifications, markAsRead, deleteNotification } from "../controllers/notification.controller.js";
import isAuth from "../middlewares/isAuth.js";

const notificationRouter = express.Router();

// Get all notifications for the logged-in user
notificationRouter.get("/", isAuth, getNotifications);

// Mark a notification as read
notificationRouter.patch("/:id/read", isAuth, markAsRead);

// Delete a notification
notificationRouter.delete("/:id", isAuth, deleteNotification);

export default notificationRouter;
