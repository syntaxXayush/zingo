"use client"

import { useState } from "react"
import { FaMinus, FaPlus, FaShoppingCart, FaDrumstickBite, FaLeaf, FaStar, FaRegStar } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, updateQuantity } from "../redux/userSlice"

export default function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0)
  const { cartItems } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleIncrease = () => {
    const newQty = quantity + 1
    setQuantity(newQty)
    dispatch(updateQuantity({ id: data._id, quantity: newQty }))
  }

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1
      setQuantity(newQty)
      dispatch(updateQuantity({ id: data._id, quantity: newQty }))
    }
  }

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(
        addToCart({
          id: data._id,
          name: data.name,
          shop: data.shop,
          price: data.price,
          quantity,
          image: data.image,
          type: data.type,
        }),
      )
    }
  }

  // Render star rating
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 animate-pulse" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400/50" />
        ),
      )
    }
    return stars
  }

  return (
    <div className="relative w-[280px] group">
      {/* Floating background elements */}
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-500" />

      <div className="relative rounded-3xl border border-border/20 bg-gradient-to-br from-card/90 via-card/80 to-background/70 backdrop-blur-xl shadow-xl overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col animate-fade-in">
        {/* Image & top icons */}
        <div className="relative w-full h-[200px] flex justify-center items-center bg-gradient-to-br from-background/60 via-card/40 to-secondary/20 backdrop-blur-lg overflow-hidden">
          {/* Floating orbs in image area */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-sm animate-float" />
          <div className="absolute bottom-6 right-6 w-6 h-6 bg-gradient-to-br from-accent/40 to-primary/40 rounded-full blur-sm animate-float-delayed" />

          {/* Veg/Non-Veg Icon */}
          <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-md rounded-full p-2 shadow-lg hover:scale-110 transition-all duration-300 border border-border/20">
            {data.type === "veg" ? (
              <FaLeaf className="text-green-500 text-lg animate-bounce" />
            ) : (
              <FaDrumstickBite className="text-red-500 text-lg animate-bounce" />
            )}
          </div>

          <img
            src={data.image || "/placeholder.svg"}
            alt={data.name}
            className="w-full h-full object-cover transition-all duration-500 hover:scale-110 rounded-2xl group-hover:brightness-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5 space-y-4">
          <div>
            <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {data.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">{data.shop}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">{renderStars(Math.round(data.rating?.average || 0))}</div>
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              ({data.rating?.count || 0} reviews)
            </span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ₹{data.price}
              </span>
            </div>

            {/* Quantity & Cart Button */}
            <div className="flex items-center bg-card/60 backdrop-blur-md border border-border/30 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <button
                onClick={handleDecrease}
                className="px-3 py-2 hover:bg-primary/10 transition-all duration-200 text-muted-foreground hover:text-primary"
                disabled={quantity === 0}
              >
                <FaMinus size={12} />
              </button>
              <span className="px-3 text-sm font-bold text-foreground min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="px-3 py-2 hover:bg-primary/10 transition-all duration-200 text-muted-foreground hover:text-primary"
              >
                <FaPlus size={12} />
              </button>
              <button
                className={`${
                  cartItems.some(i => i.id === data._id)
                    ? "bg-muted text-muted-foreground"
                    : "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                } px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 font-medium`}
                onClick={handleAddToCart}
                disabled={quantity === 0}
              >
                <FaShoppingCart size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

