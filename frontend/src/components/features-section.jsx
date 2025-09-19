"use client"

import { Card, CardContent } from "./ui/card"
import { Utensils, Zap, CreditCard, MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const features = [
  {
    icon: Utensils,
    title: "Wide Variety of Restaurants",
    description: "Choose from thousands of restaurants and cuisines in your area",
  },
  {
    icon: Zap,
    title: "Fast Delivery in under 30 minutes",
    description: "Lightning-fast delivery that gets your food to you while it's still hot",
  },
  {
    icon: CreditCard,
    title: "Secure Payments & Discounts",
    description: "Safe, encrypted payments with exclusive deals and cashback offers",
  },
  {
    icon: MapPin,
    title: "Real-time Order Tracking",
    description: "Track your order from kitchen to doorstep with live GPS updates",
  },
]

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState([])
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Zingo</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the future of food delivery with our cutting-edge platform designed for speed, convenience, and
            satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isVisible = visibleCards.includes(index)
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-105 bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary/10 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardContent className="p-8 text-center relative z-10">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 group-hover:text-primary transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>

                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>Join thousands of satisfied customers</span>
          </div>
        </div>
      </div>
    </section>
  )
}
