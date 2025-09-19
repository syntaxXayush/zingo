import Notification from "../models/notification.model.js";

export async function createOrderStatusNotification({ userId, orderId, status, shopName }) {
  let message = "";
  if (status === "preparing") message = `Your order from ${shopName} is being prepared.`;
  else if (status === "out of delivery") message = `Your order from ${shopName} is out for delivery!`;
  else if (status === "delivered") message = `Your order from ${shopName} has been delivered.`;
  else message = `Order status updated: ${status}`;

  const notif = await Notification.create({
    user: userId,
    type: "order",
    message,
    order: orderId,
  });
  return notif;
}
