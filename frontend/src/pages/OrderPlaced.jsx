import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";


export default function OrderPlaced() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/70 via-primary/10 to-white/70 backdrop-blur-xl flex flex-col justify-center items-center px-8 text-center relative overflow-hidden animate-fade-in" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.10)',WebkitBackdropFilter:'blur(12px)',backdropFilter:'blur(12px)'}}>
      <FaCheckCircle className="text-green-500 text-7xl mb-8 animate-fade-in" />
      <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-scale-in">Order Placed!</h1>
      <p className="text-xl text-pink-500 max-w-lg mb-10 font-medium animate-fade-in">
        Thank you for your purchase. Your order is being prepared.<br/>
        You can track your order status in the <span className="font-bold text-yellow-400">My Orders</span> section.
      </p>
      <button
        onClick={() => navigate("/my-orders")}
        className="bg-gradient-to-r from-primary/80 to-pink-500 text-white px-10 py-4 rounded-xl text-xl font-bold shadow-lg hover:scale-105 transition-transform animate-fade-in"
      >
        Back to My Orders
      </button>
    </div>
  );
}
