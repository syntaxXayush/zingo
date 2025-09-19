"use client"

import { Button } from "../components/ui/button"
import { ArrowRight, Play, Sparkles, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { ThemeToggle } from "../components/theme-toggle"
import { useNavigate } from "react-router-dom"

// ✅ Import your video from assets
import heroVideo from "../assets/vid.mp4"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleOrderNow = () => {
    navigate("/signup")
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-10 animate-bounce delay-300">
        <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
      </div>
      <div className="absolute top-32 right-20 animate-bounce delay-700">
        <Star className="w-4 h-4 text-primary/40" />
      </div>
      <div className="absolute bottom-32 left-20 animate-bounce delay-1000">
        <Sparkles className="w-5 h-5 text-accent/50" />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          {/* Title & Subtitle */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Fast & Fresh Delivery
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 leading-tight">
              Order Food Faster with{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Zingo
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto leading-relaxed">
            Your favorite meals, delivered hot & fresh at your doorstep in minutes.
            <span className="block mt-2 text-lg text-muted-foreground/80">
              Experience the fastest food delivery in your city.
            </span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="text-lg px-8 py-6 group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleOrderNow}
            >
              Order Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 group bg-background/80 backdrop-blur-sm border-2 hover:bg-accent/10 hover:border-primary/30 transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* ✅ Video Section */}
<div className="relative max-w-5xl mx-auto">
  <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-card via-card to-muted/20 p-2">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl"></div>
    
    {/* Video stays lower */}
    <video
      src={heroVideo}
      className="w-full h-80 md:h-96 rounded-2xl relative z-0 shadow-lg object-cover"
      autoPlay
      muted
      loop
      playsInline
      controls
    />
    
    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-sm -z-10"></div>
  </div>

  {/* Floating Stats with higher z-index */}
  <div className="absolute -top-4 -left-4 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border animate-float z-20">
    <div className="text-2xl font-bold text-primary">15min</div>
    <div className="text-sm text-muted-foreground">Avg Delivery</div>
  </div>
  <div className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border animate-float delay-500 z-20">
    <div className="text-2xl font-bold text-primary">4.9★</div>
    <div className="text-sm text-muted-foreground">User Rating</div>
  </div>
  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border animate-float delay-1000 z-20">
    <div className="text-2xl font-bold text-primary">24/7</div>
    <div className="text-sm text-muted-foreground">Available</div>
  </div>
</div>

        </div>
      </div>
    </section>
  )
}
