"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { MdLocationOn, MdOutlineCheckCircle } from "react-icons/md"
import { useSelector } from "react-redux"
import Nav from "./Nav"
import { serverUrl } from "../utils/config"
import DeliveryBoyTracking from "../pages/DeliveryBoyTracking"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const PRIMARY = "#ff4d2d"

export default function DeliveryBoy() {
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [assignments, setAssignments] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)
  const [todayStats, setTodayStats] = useState([])
  const { userData } = useSelector((state) => state.user)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState("")

  // 🔹 Track browser GPS and update backend
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setLocation(newLoc)

          try {
            await axios.post(
              `${serverUrl}/api/order/update-location`,
              {
                latitude: newLoc.lat,
                longitude: newLoc.lng,
                orderId: currentOrder?._id,
                shopOrderId: currentOrder?.shopOrder?._id,
              },
              { withCredentials: true },
            )
          } catch (err) {
            console.error("Location update failed", err)
          }
        },
        (err) => {
          console.error("Geolocation error:", err)
          // Handle different types of geolocation errors
          if (err.code === 1) {
            alert("Location access denied. Please allow location access for delivery tracking.")
          } else if (err.code === 2) {
            alert("Location unavailable. Please check your device's location settings.")
          } else if (err.code === 3) {
            alert("Location request timed out. Try moving to an open area or check your connection.")
          } else {
            alert("An unknown geolocation error occurred.")
          }
        },
        {
          enableHighAccuracy: true, // Enable high accuracy for better results
          maximumAge: 10000, // Cache location for 10 seconds
          timeout: 30000, // Increase timeout to 30 seconds
        },
      )

      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      alert("Geolocation is not supported by this browser")
    }
  }, [currentOrder])

  // 🔹 Fetch available assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/getassignments`, {
          withCredentials: true,
        })
        if (res.data.success) setAssignments(res.data.assignments)
      } catch (err) {
        console.error(err)
      }
    }

    fetchAssignments()
    const interval = setInterval(fetchAssignments, 2000)
    return () => clearInterval(interval)
  }, [])

  // 🔹 Fetch current order
  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/current-order`, {
          withCredentials: true,
        })
        if (res.data.success) setCurrentOrder(res.data.order)
      } catch (err) {
        console.error(err)
      }
    }

    fetchCurrent()
    const interval = setInterval(fetchCurrent, 2000)
    return () => clearInterval(interval)
  }, [])

  // 🔹 Fetch today's stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/stats/today`, {
          withCredentials: true,
        })
        if (res.data.success) setTodayStats(res.data.stats)
      } catch (err) {
        console.error("Failed to fetch today stats", err)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  // 🔹 Accept assignment
  const acceptOrder = async (id) => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/accept-assignment/${id}`, { withCredentials: true })
      if (res.data.success) {
        setAssignments(assignments.filter((a) => a.assignmentId !== id))
        setCurrentOrder(res.data.order)
        alert("Order accepted successfully!")
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 🔹 Send OTP request
  const sendOtp = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/send-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true },
      )

      if (res.data.success) {
        setShowOtpBox(true)
        alert(res.data.message)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to send OTP")
    }
  }

  // 🔹 Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/verify-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true },
      )

      if (res.data.success) {
        alert("Order delivered successfully!")
        setCurrentOrder(null)
        setShowOtpBox(false)
        setOtp("")
      } else {
        alert(res.data.message || "Invalid OTP")
      }
    } catch (err) {
      console.error(err)
      alert("OTP verification failed")
    }
  }

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-red-200/20 to-orange-200/20 rounded-full blur-lg animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-r from-orange-300/25 to-red-300/25 rounded-full blur-lg animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-red-300/20 to-orange-300/20 rounded-full blur-md animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 overflow-y-auto">
        <Nav />

        {/* Fixed container with proper alignment */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Welcome Card */}
            <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl p-6 sm:p-8 flex justify-between items-center border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Welcome, {userData.fullName}
                </h1>
                {location.lat && (
                  <p className="text-gray-600 text-sm flex items-center gap-2 mt-2">
                    <MdLocationOn size={18} className="text-orange-500" />
                    <span className="font-medium">Live Location:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </span>
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MdLocationOn size={24} className="text-white" />
              </div>
            </div>

            {/* Today's Deliveries Chart */}
            <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl p-6 sm:p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Today's Deliveries
                </h2>
              </div>
              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl p-4 border border-blue-100/50">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={todayStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [value, "Orders"]}
                      labelFormatter={(label) => `${label}:00`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Current Order Section */}
            {currentOrder && !currentOrder.shopOrder.deliveredAt && (
              <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 animate-slideInLeft">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center animate-pulse">
                    <span className="text-white text-lg">🚴</span>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Current Order
                  </h2>
                </div>

                <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl p-5 mb-4 border border-green-100/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏪</span>
                    </div>
                    <p className="font-bold text-gray-800">{currentOrder.shopOrder.shop?.name || "Shop"}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-gray-700 flex items-center gap-2">
                      <MdLocationOn className="text-red-500" />
                      Delivery Address:
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 ml-6 border border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {currentOrder.address?.text}
                        <br />
                        {currentOrder.address?.flat && (
                          <span className="text-gray-600">
                            Flat/House: {currentOrder.address.flat}
                            <br />
                          </span>
                        )}
                        {currentOrder.address?.landmark && (
                          <span className="text-gray-600">
                            Landmark: {currentOrder.address.landmark}
                            <br />
                          </span>
                        )}
                        {currentOrder.address?.pincode && (
                          <span className="text-gray-600">
                            Pincode: {currentOrder.address.pincode}
                            <br />
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-blue-500 text-lg">📞</span>
                      <p className="font-semibold text-gray-700">Customer Phone:</p>
                    </div>
                    <p className="text-gray-700 font-mono bg-white/60 rounded-lg px-3 py-2 ml-6">
                      {currentOrder.phone || currentOrder.user?.mobile || "N/A"}
                    </p>

                    <div className="flex items-center justify-between mt-4 bg-white/60 rounded-lg p-3">
                      <span className="text-gray-600 font-medium">{currentOrder.shopOrder.items.length} items</span>
                      <span className="font-bold text-green-600 text-lg">₹{currentOrder.shopOrder.subtotal}</span>
                    </div>
                  </div>
                </div>

                <DeliveryBoyTracking currentOrder={currentOrder} />

                {!showOtpBox ? (
                  <button
                    className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                    onClick={sendOtp}
                  >
                    <span className="text-xl">✅</span>
                    Mark As Delivered
                  </button>
                ) : (
                  <div className="mt-6 p-6 backdrop-blur-sm bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50">
                    <p className="text-sm font-semibold mb-4 text-center">
                      Enter OTP sent to <span className="text-orange-600 font-bold">{currentOrder.user?.fullName}</span>
                    </p>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full border-2 border-blue-200 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-center font-mono text-lg"
                    />
                    <button
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                      onClick={verifyOtp}
                    >
                      Submit OTP
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Available Orders Section */}
            {!currentOrder && (
              <div className="backdrop-blur-md bg-white/80 rounded-3xl shadow-xl p-6 sm:p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 animate-slideInRight">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MdOutlineCheckCircle size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Available Orders Nearby
                  </h2>
                </div>

                <div className="space-y-4">
                  {assignments.length > 0 ? (
                    assignments.map((order, index) => (
                      <div
                        key={order.assignmentId}
                        className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl p-5 flex justify-between items-center border border-purple-100/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs">🏪</span>
                            </div>
                            <p className="font-bold text-gray-800">{order.shopName}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <MdLocationOn size={14} className="text-gray-400" />
                            {order.address?.street}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
                              {order.items.length} items
                            </span>
                            <span className="font-bold text-green-600">₹{order.subtotal}</span>
                          </div>
                        </div>
                        <button
                          className="ml-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                          onClick={() => acceptOrder(order.assignmentId)}
                        >
                          Accept
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📦</span>
                      </div>
                      <p className="text-gray-500 font-medium">No new assignments</p>
                      <p className="text-gray-400 text-sm mt-1">Check back in a few minutes</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}