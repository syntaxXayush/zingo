"use client"

import axios from "axios"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { serverUrl } from "../utils/config"
import { useDispatch } from "react-redux"
import { setShop } from "../redux/userSlice"

export default function OwnerFoodCard({ item }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleDelete = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete/${item._id}`, { withCredentials: true })
      dispatch(setShop(result.data.shop))
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div
      className="relative flex bg-gradient-to-br from-white/90 via-primary/5 to-white/90 rounded-3xl shadow-xl overflow-hidden border border-primary/20 w-full max-w-2xl backdrop-blur-xl animate-fade-in hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 group"
      style={{
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)",
        WebkitBackdropFilter: "blur(16px)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-primary/20 rounded-full blur-lg animate-float-delayed"></div>
      </div>
      <div className="relative w-36 h-full flex-shrink-0 bg-gradient-to-br from-primary/10 via-pink-100/50 to-white/80 flex items-center justify-center overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover rounded-2xl scale-105 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-col justify-between p-6 flex-1 relative z-10">
        <div>
          <h3 className="text-xl font-extrabold bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-2 animate-fade-in group-hover:scale-105 transition-transform duration-300">
            {item.name}
          </h3>
          <p className="text-gray-700 text-base mt-1 line-clamp-2 animate-fade-in-slow leading-relaxed">
            {item.description}
          </p>
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">Category:</span>
              <span className="px-2 py-1 bg-primary/10 rounded-full text-xs font-medium">{item.category || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-pink-500">Type:</span>
              <span className="px-2 py-1 bg-pink-500/10 rounded-full text-xs font-medium">{item.type || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-500">Availability:</span>
              {item.availability ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Available
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Not Available
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-fade-in group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
            ₹{item.price}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/editItem/${item._id}`)}
              className="relative p-3 rounded-full bg-gradient-to-br from-primary/20 via-pink-100/50 to-white/80 text-primary shadow-lg hover:shadow-primary/30 hover:scale-110 hover:rotate-3 transition-all duration-300 animate-fade-in group/btn backdrop-blur-sm border border-primary/20"
            >
              <FiEdit size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
            <button
              className="relative p-3 rounded-full bg-gradient-to-br from-red-100/50 via-pink-100/50 to-white/80 text-red-500 shadow-lg hover:shadow-red-500/30 hover:scale-110 hover:rotate-3 transition-all duration-300 animate-fade-in group/btn backdrop-blur-sm border border-red-500/20"
              onClick={handleDelete}
            >
              <FiTrash2 size={20} className="group-hover/btn:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
