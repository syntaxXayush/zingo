// Simple star rating component
function StarRating({ value, onChange, disabled }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            "cursor-pointer text-2xl " +
            (star <= value ? "text-yellow-400" : "text-gray-300") +
            (disabled ? " opacity-60 cursor-default" : "")
          }
          onClick={() => !disabled && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../utils/config";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders, addToCart } from "../redux/userSlice";
import { MdKeyboardBackspace } from "react-icons/md";


export default function MyOrders() {
  const { myOrders, socket } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const toastTimeout = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Review state (moved inside component)
  const [reviewInputs, setReviewInputs] = useState({});
  const [submittingReview, setSubmittingReview] = useState({});
  const [itemReviews, setItemReviews] = useState({});

  // Fetch reviews for delivered items
  useEffect(() => {
    if (!myOrders) return;
    const delivered = myOrders.filter(o => o.shopOrders?.[0]?.status === "delivered");
    delivered.forEach(order => {
      order.shopOrders.forEach(shopOrder => {
        shopOrder.items.forEach(async (item) => {
          if (!item.item?._id && !item.item) return;
          const itemId = item.item?._id || item.item;
          try {
            const res = await axios.get(`${serverUrl}/api/review/item/${itemId}`);
            setItemReviews(prev => ({ ...prev, [itemId]: res.data.reviews || [] }));
          } catch {
            // Ignore fetch errors for reviews
          }
        });
      });
    });
  }, [myOrders]);

  const handleReviewInput = (itemId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  const submitReview = async (item, orderId) => {
    const itemId = item.item?._id || item.item;
    const input = reviewInputs[itemId];
    if (!input || !input.rating) return;
    setSubmittingReview((prev) => ({ ...prev, [itemId]: true }));
    try {
      await axios.post(
        `${serverUrl}/api/review`,
        {
          item: itemId,
          order: orderId,
          rating: input.rating,
          comment: input.comment || "",
        },
        { withCredentials: true }
      );
      setReviewInputs((prev) => ({ ...prev, [itemId]: {} }));
      // Refresh reviews
      const res = await axios.get(`${serverUrl}/api/review/item/${itemId}`);
      setItemReviews((prev) => ({ ...prev, [itemId]: res.data.reviews || [] }));
    } catch {
      alert("Failed to submit review");
    }
    setSubmittingReview((prev) => ({ ...prev, [itemId]: false }));
  };

  // Reorder handler: add all items from the order to cart and go to cart page
  const handleReorder = (order) => {
    // Flatten all items from all shopOrders
    const allItems = order.shopOrders.flatMap((shopOrder) =>
      shopOrder.items.map((item) => ({
        id: item.item?._id || item.item,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.item?.image || "/placeholder.png",
        shop: shopOrder.shop?._id || shopOrder.shop,
      }))
    );
    allItems.forEach((item) => {
      dispatch(addToCart(item));
    });
    navigate("/cart");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/getmy`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setMyOrders(res.data.orders));
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [dispatch]);

  // Toast for order status updates
  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      const status = data?.shopOrder?.status;
      let msg = null;
      if (status === "preparing") msg = "Your order is being prepared.";
      else if (status === "out of delivery") msg = "Your order is out for delivery!";
      else if (status === "delivered") msg = "Your order has been delivered.";
      if (msg) {
        setToast(msg);
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => setToast(null), 4000);
      }
    };
    socket.on("orders:statusUpdated", handler);
    return () => socket.off("orders:statusUpdated", handler);
  }, [socket]);

  // socket listener
  useEffect(() => {
    if (!socket) return;
    socket.on("orders:statusUpdated", (data) => {
      dispatch(
        setMyOrders(
          myOrders.map((order) => {
            if (order._id === data.orderId) {
              return {
                ...order,
                shopOrders: order.shopOrders.map((so) =>
                  so._id === data.shopOrder._id
                    ? { ...so, status: data.shopOrder.status }
                    : so
                ),
              };
            }
            return order;
          })
        )
      );
    });
  }, [socket, myOrders, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!loading && myOrders?.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-white/70 via-primary/10 to-white/70 backdrop-blur-xl px-8 animate-fade-in" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.10)',WebkitBackdropFilter:'blur(12px)',backdropFilter:'blur(12px)'}}>
        <p className="text-pink-500 text-2xl font-bold mb-6 animate-fade-in">You have no orders yet.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-primary/80 to-pink-500 text-white px-10 py-4 rounded-xl text-xl font-bold shadow-lg hover:scale-105 transition-transform animate-fade-in"
        >
          Start Shopping
        </button>
      </div>
    );
  }


  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white/70 via-primary/10 to-white/70 backdrop-blur-xl flex justify-center px-8 animate-fade-in" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.10)',WebkitBackdropFilter:'blur(12px)',backdropFilter:'blur(12px)'}}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-pink-500 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-bold animate-fade-in">
          {toast}
        </div>
      )}
      <div className="w-full max-w-2xl p-8 bg-gradient-to-br from-white/80 via-primary/10 to-white/80 shadow-2xl rounded-3xl animate-fade-in" style={{boxShadow:'0 4px 24px 0 rgba(31,38,135,0.10)'}}>
        {/* Header */}
        <div className="flex gap-8 items-center mb-10">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <MdKeyboardBackspace className="w-8 h-8 text-pink-500 hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent">My Orders</h1>
        </div>

        <div className="space-y-8">
          {myOrders?.map((order) => (
            <div
              key={order?._id}
              className="bg-gradient-to-br from-white/90 via-primary/10 to-white/90 rounded-2xl shadow-lg p-8 space-y-6 border border-pink-500/10 animate-fade-in"
              style={{boxShadow:'0 2px 8px 0 rgba(31,38,135,0.10)'}}
            >
              {/* Order Info */}
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-bold text-primary text-lg">
                    Order #{order?._id?.slice(-6)}
                  </p>
                  <p className="text-base text-pink-500 font-semibold">
                    Date: {formatDate(order?.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base text-pink-500 font-semibold">
                    Payment: {order?.paymentMethod?.toUpperCase()}
                  </p>
                  <p className="text-base text-yellow-400 font-bold">
                    Status: <span>{order?.shopOrders?.[0]?.status}</span>
                  </p>
                </div>
              </div>

              {/* Shop-wise Orders */}
              {order?.shopOrders?.map((shopOrder, idx) => (
                <div
                  key={idx}
                  className="border border-pink-500/10 rounded-xl p-4 bg-pink-500/5 space-y-4 animate-fade-in"
                >
                  {/* Shop Name */}
                  <p className="font-bold text-primary text-lg">
                    {shopOrder?.shop?.name || "N/A"}
                  </p>

                  {/* Items */}
                  <div className="flex space-x-6 overflow-x-auto pb-2">
                    {shopOrder.items.map((item) => {
                      const itemId = item.item?._id || item.item;
                      const reviews = itemReviews[itemId] || [];
                      // Try to get current user id from redux (if available)
                      let currentUserId = null;
                      try {
                        const state = JSON.parse(localStorage.getItem('persist:root'));
                        if (state && state.user) {
                          const userState = JSON.parse(state.user);
                          currentUserId = userState.currentUser?._id;
                        }
                      } catch {
                        // Intentionally empty: ignore errors parsing user from localStorage
                      }
                      const userReview = reviews.find(r => r.user?._id === currentUserId);
                      return (
                        <div
                          key={item?._id}
                          className="flex-shrink-0 w-56 border border-pink-500/10 rounded-xl p-3 bg-white shadow-md animate-fade-in"
                        >
                          <img
                            src={item?.item?.image || "/placeholder.png"}
                            alt={item?.name}
                            className="w-full h-28 object-cover rounded-xl"
                          />
                          <p className="text-base font-bold text-primary mt-2">
                            {item?.name}
                          </p>
                          <p className="text-sm text-pink-500 font-semibold">
                            Qty: {item?.quantity} × ₹{item?.price}
                          </p>
                          {/* Show review form if delivered and not already reviewed by this user */}
                          {order.shopOrders?.[0]?.status === "delivered" && (
                            userReview ? (
                              <div className="mt-2 text-green-600 text-xs font-semibold">You have already reviewed this item.</div>
                            ) : (
                              <div className="mt-2">
                                <div className="mb-1 text-xs text-gray-500 font-semibold">Your Review:</div>
                                <StarRating
                                  value={reviewInputs[itemId]?.rating || 0}
                                  onChange={(val) => handleReviewInput(itemId, "rating", val)}
                                  disabled={submittingReview[itemId]}
                                />
                                <textarea
                                  className="w-full mt-1 p-1 border rounded text-sm"
                                  rows={2}
                                  placeholder="Write a comment (optional)"
                                  value={reviewInputs[itemId]?.comment || ""}
                                  onChange={e => handleReviewInput(itemId, "comment", e.target.value)}
                                  disabled={submittingReview[itemId]}
                                />
                                <button
                                  className="mt-1 px-3 py-1 bg-pink-500 text-white rounded text-xs font-bold hover:bg-pink-600 disabled:opacity-60"
                                  onClick={() => submitReview(item, order._id)}
                                  disabled={submittingReview[itemId] || !reviewInputs[itemId]?.rating}
                                >
                                  {submittingReview[itemId] ? "Submitting..." : "Submit Review"}
                                </button>
                              </div>
                            )
                          )}
                          {/* Show all reviews for this item */}
                          <div className="mt-2">
                            {reviews.length > 0 ? (
                              <>
                                <div className="text-xs text-gray-500 font-semibold mb-1">All Reviews:</div>
                                {reviews.map((r, idx) => (
                                  <div key={idx} className="mb-1 p-1 bg-yellow-50 rounded">
                                    <div className="flex items-center gap-1">
                                      <StarRating value={r.rating} disabled />
                                      <span className="text-xs text-gray-700 font-bold">{r.user?.fullName || "User"}</span>
                                    </div>
                                    {r.comment && <div className="text-xs text-gray-600 mt-0.5">{r.comment}</div>}
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="text-xs text-gray-400 italic">No reviews yet for this item.</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shop Subtotal */}
                  <div className="flex justify-between items-center border-t pt-3">
                    <p className="font-bold text-primary">
                      Subtotal: ₹{shopOrder?.subtotal}
                    </p>
                    <span className="text-base font-bold text-yellow-400">
                      {shopOrder?.status}
                    </span>
                  </div>
                </div>
              ))}

              {/* Overall Order Total */}
              <div className="flex justify-between items-center border-t pt-3">
                <p className="font-bold text-pink-500 text-xl">Total: ₹{order?.totalAmount}</p>

                {order?.shopOrders?.[0]?.status === "delivered" ? (
                  <div className="flex gap-4 items-center">
                    <span className="text-green-600 font-extrabold text-lg">
                      Delivered ✅
                    </span>
                    <button
                      onClick={() => handleReorder(order)}
                      className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition-transform animate-fade-in"
                    >
                      Reorder
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/track-order/${order._id}`)}
                    className="bg-gradient-to-r from-primary/80 to-pink-500 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition-transform animate-fade-in"
                  >
                    Track Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
