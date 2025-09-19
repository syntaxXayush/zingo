"use client"

import { useRef, useState, useEffect } from "react"
import Nav from "./Nav"
import { categories } from "../category"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import CategoryCard from "./CategoryCard"
import FoodCard from "./FoodCard"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function UserDashboard() {
  const { city, shopsOfCity, itemsOfCity, searchItems } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const cateScrollRef = useRef(null)
  const shopScrollRef = useRef(null)
  const [updatedItemsList, setUpdatedItemslist] = useState([])
  const [showCateLeft, setShowCateLeft] = useState(false)
  const [showCateRight, setShowCateRight] = useState(false)
  const [showShopLeft, setShowShopLeft] = useState(false)
  const [showShopRight, setShowShopRight] = useState(false)

  const handleFilter = (category) => {
    if (category === "All") {
      setUpdatedItemslist(itemsOfCity)
    } else {
      const filteredList = itemsOfCity?.filter((i) => i.category === category)
      setUpdatedItemslist(filteredList)
    }
  }

  const updateButtons = (ref, setLeft, setRight) => {
    const el = ref.current
    if (!el) return
    setLeft(el.scrollLeft > 0)
    setRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const cateEl = cateScrollRef.current
    const shopEl = shopScrollRef.current

    const cateScrollListener = () => updateButtons(cateScrollRef, setShowCateLeft, setShowCateRight)
    const shopScrollListener = () => updateButtons(shopScrollRef, setShowShopLeft, setShowShopRight)

    if (cateEl) {
      updateButtons(cateScrollRef, setShowCateLeft, setShowCateRight)
      cateEl.addEventListener("scroll", cateScrollListener)
    }
    if (shopEl) {
      updateButtons(shopScrollRef, setShowShopLeft, setShowShopRight)
      shopEl.addEventListener("scroll", shopScrollListener)
    }

    return () => {
      if (cateEl) cateEl.removeEventListener("scroll", cateScrollListener)
      if (shopEl) shopEl.removeEventListener("scroll", shopScrollListener)
    }
  }, [shopsOfCity])

  useEffect(() => {
    setUpdatedItemslist(itemsOfCity)
  }, [itemsOfCity])

  return (
    <div className="w-full flex flex-col gap-8 items-center animate-fade-in relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute top-1/3 -left-40 w-60 h-60 bg-gradient-to-br from-secondary/20 to-purple-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-accent/20 to-orange-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </div>

      {/* Navigation - Highest z-index for dropdowns */}
      <Nav />

      {/* Main content - Lower z-index to allow nav dropdowns to appear above */}
      <div className="w-full flex flex-col gap-8 items-center relative z-1 pt-16">
        {searchItems && searchItems.length > 0 && (
          <div className="w-full flex flex-col gap-6 items-start p-8 bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 group hover:bg-white/15 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h1 className="text-3xl sm:text-4xl font-extrabold border-b border-primary/20 pb-3 bg-gradient-to-r from-primary via-pink-500 to-yellow-400 bg-clip-text text-transparent relative z-10">
              Search Results
            </h1>
            <div className="w-full h-auto flex flex-wrap gap-6 justify-center relative z-10">
              {searchItems.map((item, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <FoodCard data={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-6 items-start p-6">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in">
              Inspiration for your{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative">
                first order
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30" />
              </span>
            </h1>
          </div>

          <div className="relative w-full group">
            {showCateLeft && (
              <button
                onClick={() => scrollHandler(cateScrollRef, "left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/90 to-pink-500/90 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-primary/25 transition-all duration-300 z-20 backdrop-blur-sm border border-white/20"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div ref={cateScrollRef} className="w-full flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth px-4">
              {categories?.map((cate, index) => (
                <div key={index} className="animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CategoryCard name={cate.category} image={cate.image} onClick={() => handleFilter(cate.category)} />
                </div>
              ))}
            </div>

            {showCateRight && (
              <button
                onClick={() => scrollHandler(cateScrollRef, "right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/90 to-pink-500/90 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-primary/25 transition-all duration-300 z-20 backdrop-blur-sm border border-white/20"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-6 items-start p-6">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in">
              Best shops in{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative">
                {city}
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30" />
              </span>
            </h1>
          </div>

          <div className="relative w-full group">
            {showShopLeft && (
              <button
                onClick={() => scrollHandler(shopScrollRef, "left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/90 to-pink-500/90 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-primary/25 transition-all duration-300 z-20 backdrop-blur-sm border border-white/20"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
            )}

            <div ref={shopScrollRef} className="w-full flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth px-4">
              {shopsOfCity?.map((shop, index) => (
                <div key={index} className="animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CategoryCard name={shop.name} image={shop.image} onClick={() => navigate(`/shop-items/${shop._id}`)} />
                </div>
              ))}
            </div>

            {showShopRight && (
              <button
                onClick={() => scrollHandler(shopScrollRef, "right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary/90 to-pink-500/90 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-primary/25 transition-all duration-300 z-20 backdrop-blur-sm border border-white/20"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-6 items-start p-6">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in">
              Suggested{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative">
                items
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30" />
              </span>
            </h1>
          </div>

          {updatedItemsList?.length > 0 && (
            <div className="w-full h-auto flex flex-wrap gap-8 justify-center">
              {updatedItemsList?.map((item, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <FoodCard data={item} />
                </div>
              ))}
            </div>
          )}

          {updatedItemsList?.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="text-6xl mb-4 opacity-30">🍽️</div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-muted-foreground to-muted-foreground/60 bg-clip-text text-transparent text-center">
                No Items Found
              </div>
              <p className="text-muted-foreground mt-2 text-center max-w-md">
                Try adjusting your filters or explore different categories to discover delicious options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
