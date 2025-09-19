"use client"

import Nav from "./Nav"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaUtensils, FaPen, FaPlus } from "react-icons/fa"
import OwnerFoodCard from "./OwnerFoodCard"
import { useEffect } from "react"
import { setPendingOrdersCount } from "../redux/userSlice"

function OwnerDashboard() {
  const { shop, ownerPendingOrders } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const pending = ownerPendingOrders.filter((order) => order.shopOrder.status === "pending")
    dispatch(setPendingOrdersCount(pending.length))
  }, [ownerPendingOrders, dispatch])

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      <Nav />

      {/* Main Content Container */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto py-6">

          {/* If no shop */}
          {!shop && (
            <div className="flex justify-center items-center p-4 sm:p-6">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 hover:scale-[1.05] hover:shadow-3xl hover:bg-white/15 transition-all duration-500 group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <FaUtensils className="text-orange-500 w-20 h-20 animate-bounce drop-shadow-lg" />
                    <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-pulse"></div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                    Add Your Restaurant
                  </h2>
                  <p className="text-gray-700 mb-6 text-base leading-relaxed">
                    Join our food delivery platform and reach thousands of hungry customers every day.
                  </p>

                  <button
                    className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group-hover:shadow-orange-500/25"
                    onClick={() => navigate("/editshop")}
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* If shop exists but no items */}
          {shop && shop?.items?.length === 0 && (
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl flex items-center justify-center gap-4 mt-8 text-center">
                <FaUtensils className="text-orange-500 animate-bounce drop-shadow-lg" />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
                  Welcome to {shop.name}
                </span>
              </h1>

              {/* Shop Info Card with Fixed Layout */}
              <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 hover:scale-[1.02] hover:shadow-3xl hover:bg-white/15 transition-all duration-500 relative group">
                <button
                  onClick={() => navigate("/editshop")}
                  className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10"
                >
                  <FaPen />
                </button>

                {/* Image Container with proper height */}
                <div className="relative overflow-hidden h-48 sm:h-64">
                  <img
                    src={shop.image || "/placeholder.svg"}
                    alt={shop.name}
                    className="w-full h-full object-cover animate-fade-in group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Text Content - Now properly separated from image */}
                <div className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{shop.name}</h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    {shop.city}, {shop.state}
                  </p>
                  <p className="text-gray-700 mb-6 leading-relaxed">{shop.address}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Created: {new Date(shop.createdAt).toLocaleString()}</p>
                    <p>Last Updated: {new Date(shop.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Add Items Card */}
              <div className="flex items-center justify-center w-full">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 sm:p-10 w-full max-w-2xl text-center hover:scale-[1.02] hover:shadow-3xl hover:bg-white/15 transition-all duration-500 group">
                  <div className="relative mb-6">
                    <FaUtensils className="text-orange-500 text-6xl mx-auto animate-bounce drop-shadow-lg" />
                    <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-pulse mx-auto w-16 h-16 top-2"></div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                    Add Your Food Items
                  </h2>
                  <p className="text-gray-700 mb-8 text-base leading-relaxed">
                    Share your delicious creations with our customers by adding them to the menu.
                  </p>

                  <button
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group-hover:shadow-orange-500/25"
                    onClick={() => navigate("/additem")}
                  >
                    <FaPlus className="animate-pulse" /> Add Item
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* If shop and items exist */}
          {shop && shop?.items.length > 0 && (
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl flex items-center justify-center gap-4 mt-8 text-center">
                <FaUtensils className="text-orange-500 animate-bounce drop-shadow-lg" />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
                  Welcome to {shop.name}
                </span>
              </h1>

              {/* Shop Info Card with Fixed Layout */}
              <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 hover:scale-[1.02] hover:shadow-3xl hover:bg-white/15 transition-all duration-500 relative group">
                <button
                  onClick={() => navigate("/editshop")}
                  className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10"
                >
                  <FaPen />
                </button>

                {/* Image Container with proper height */}
                <div className="relative overflow-hidden h-48 sm:h-64">
                  <img
                    src={shop.image || "/placeholder.svg"}
                    alt={shop.name}
                    className="w-full h-full object-cover animate-fade-in group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Text Content - Now properly separated from image */}
                <div className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{shop.name}</h2>
                  <p className="text-gray-600 mb-4 text-lg">
                    {shop.city}, {shop.state}
                  </p>
                  <p className="text-gray-700 mb-6 leading-relaxed">{shop.address}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Created: {new Date(shop.createdAt).toLocaleString()}</p>
                    <p>Last Updated: {new Date(shop.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Food Items Grid */}
              <div className="space-y-6">
                {shop?.items.map((item, index) => (
                  <div className="animate-fade-in-up" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                    <OwnerFoodCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Single Footer - moved outside main content */}
    
    </div>
  )
}

export default OwnerDashboard