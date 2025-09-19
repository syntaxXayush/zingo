import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { updateQuantity, removeFromCart } from "../redux/userSlice";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex justify-center p-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <MdKeyboardBackspace className="w-8 h-8 text-primary hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Your Cart
          </h1>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg text-center font-medium">
            Your cart is empty.
          </p>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                      <p className="font-bold text-primary text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Qty Controls & Remove */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="font-semibold text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                    >
                      <FaPlus size={12} />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & Checkout */}
            <div className="mt-8 bg-gray-50 p-6 rounded-2xl shadow-sm flex justify-between items-center border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Amount
              </h3>
              <span className="text-2xl font-bold text-primary">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <div className="mt-6 flex justify-end">
              <button
                className="bg-gradient-to-r from-primary to-pink-500 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:scale-105 transition"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
