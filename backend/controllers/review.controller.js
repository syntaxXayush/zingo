import Review from "../models/review.model.js";
import Order from "../models/order.model.js";

// POST /api/review - Submit a review
export const submitReview = async (req, res) => {
  try {
    const { item, order, rating, comment } = req.body;
    if (!item || !order || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    // Check if user already reviewed this item in this order
    const existing = await Review.findOne({ user: req.userId, item, order });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already reviewed this item for this order." });
    }
    // Optionally: Check if order is delivered and belongs to user
    const orderDoc = await Order.findById(order);
    if (!orderDoc || String(orderDoc.user) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }
    const review = await Review.create({
      user: req.userId,
      item,
      order,
      rating,
      comment,
    });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/review/item/:itemId - Get all reviews for an item
export const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ item: itemId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/review/order/:orderId - Get all reviews for an order (by user)
export const getOrderReviews = async (req, res) => {
  try {
    const { orderId } = req.params;
    const reviews = await Review.find({ order: orderId, user: req.userId });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
