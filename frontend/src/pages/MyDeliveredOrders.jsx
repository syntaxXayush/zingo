import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../utils/config";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function MyDeliveredOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/my-delivered-orders`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Error fetching delivered orders:", err);
      }
    };

    fetchDeliveredOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="No orders"
          className="w-28 mb-4 opacity-70"
        />
        <p className="text-lg font-semibold tracking-wide">
          No delivered orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page Heading */}
      <h2 className="flex items-center text-3xl font-extrabold mb-8 tracking-tight">
        <button
          onClick={() => navigate("/")}
          className="mr-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <MdKeyboardBackspace className="w-6 h-6 text-[#ff4d2d]" />
        </button>
        <span className="mr-2">📦</span>
        <span className="text-[#ff4d2d]">My Delivered Orders</span>
      </h2>

      {/* Orders List */}
      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition transform hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <p className="text-sm text-gray-500">
                Order ID:{" "}
                <span className="font-mono text-gray-700">{order._id}</span>
              </p>
              <span className="text-xs px-3 py-1 rounded-full font-semibold bg-green-100 text-green-600 shadow-sm">
                Delivered
              </span>
            </div>

            {/* Shop Orders */}
            {order.shopOrders
              .filter((so) => so.status === "delivered")
              .map((so) => (
                <div
                  key={so._id}
                  className="bg-gray-50 rounded-xl p-5 mb-4 border border-gray-200 hover:shadow-md transition"
                >
                  <p className="font-bold text-lg text-[#ff4d2d]">
                    🏪 {so.shop?.name}
                  </p>

                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    {so.items.map((it) => (
                      <li
                        key={it._id}
                        className="flex justify-between items-center border-b last:border-0 pb-1"
                      >
                        <span>
                          {it.name} × {it.quantity}
                        </span>
                        <span className="font-semibold text-[#ff4d2d]">
                          ₹{it.price}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Totals */}
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="text-gray-500">
                      Total Items: {so.items.length}
                    </span>
                    <span className="font-bold text-lg text-[#ff4d2d]">
                      Subtotal: ₹{so.subtotal}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
