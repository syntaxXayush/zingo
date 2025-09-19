import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../utils/config";
import UserDeliveryTracking from "../components/userDeliveryTracking";
import { MdKeyboardBackspace } from "react-icons/md";
const PRIMARY = "#ff4d2d";

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
const navigate=useNavigate()
    const fetchOrder = useCallback(async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/${orderId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch {
        setOrder(null);
      }
    }, [orderId]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (!order) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-white/70 via-primary/10 to-white/70 backdrop-blur-xl px-8 animate-fade-in" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.10)',WebkitBackdropFilter:'blur(12px)',backdropFilter:'blur(12px)'}}>
      <p className="text-pink-500 text-2xl font-bold mb-6 animate-fade-in">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-10 flex flex-col gap-10 bg-gradient-to-br from-white/70 via-primary/10 to-white/70 backdrop-blur-xl animate-fade-in" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.10)',WebkitBackdropFilter:'blur(12px)',backdropFilter:'blur(12px)'}}>
      <div className="flex gap-8 items-center mb-10">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <MdKeyboardBackspace className="w-8 h-8 text-pink-500 hover:scale-110 transition-transform" />
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent">Track Order</h1>
      </div>
      {order.shopOrders.map((shopOrder) => (
        <div
          key={shopOrder._id}
          className="bg-gradient-to-br from-white/90 via-primary/10 to-white/90 p-8 rounded-3xl shadow-lg border border-pink-500/10 space-y-6 animate-fade-in"
          style={{boxShadow:'0 2px 8px 0 rgba(31,38,135,0.10)'}}
        >
          {/* Shop & Order Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent">
              {shopOrder.shop?.name || "Shop"}
            </h2>
            <p className="text-lg text-pink-500 font-semibold">
              <span className="font-bold text-primary">Items:</span> {shopOrder.items.map((i) => i.name).join(", ")}
            </p>
            <p className="text-lg text-yellow-400 font-bold">
              <span className="font-bold text-primary">Subtotal:</span> ₹{shopOrder.subtotal}
            </p>
            <p className="mt-4 text-lg text-primary font-bold">
              <span className="font-bold text-pink-500">Customer Address:</span> {order.address.text}
            </p>
          </div>

          {/* Delivery Info */}
          {shopOrder.status === "delivered" ? (
            <p className="text-green-600 font-extrabold text-xl animate-fade-in">
              Delivered ✅
            </p>
          ) : (
            <>
              {/* Real OTP Display (only for user, if available) */}
              {shopOrder._showOtp && (
                <div className="mb-4">
                  <span className="font-bold text-primary">Delivery OTP: </span>
                  <span className="text-2xl font-mono bg-yellow-100 px-3 py-1 rounded-lg shadow">
                    {shopOrder._showOtp}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">(valid for 5 min)</span>
                </div>
              )}
              {/* Delivery Boy Info */}
              <div>
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent">Delivery Boy</h2>
                {shopOrder.assignedDeliveryBoy ? (
                  <div className="text-lg text-primary font-bold">
                    <p>
                      <span className="font-bold text-pink-500">Name:</span> {shopOrder.assignedDeliveryBoy.fullName}
                    </p>
                    <p>
                      <span className="font-bold text-yellow-400">Phone:</span> {shopOrder.assignedDeliveryBoy.mobile}
                    </p>
                  </div>
                ) : (
                  <p className="text-pink-500 italic font-semibold">Delivery boy not assigned yet</p>
                )}
              </div>

              {/* Tracking Map */}
              {shopOrder.assignedDeliveryBoy && (
                <div className="h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl animate-fade-in" style={{boxShadow:'0 2px 8px 0 rgba(31,38,135,0.10)'}}>
                  <UserDeliveryTracking
                    orderId={order._id}
                    shopOrderId={shopOrder._id}
                    userLocation={{
                      lat: order.address.latitude,
                      lng: order.address.longitude,
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
