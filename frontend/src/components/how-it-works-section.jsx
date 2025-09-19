"use client"

import { Card, CardContent } from "./ui/card"
import { ClipboardList, Utensils, Bike, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

const steps = [
  {
    icon: Utensils,
    title: "Choose Meal",
    description: "Browse top restaurants and pick your favorites.",
  },
  {
    icon: ClipboardList,
    title: "Place Order",
    description: "Secure checkout with multiple payment options.",
  },
  {
    icon: Bike,
    title: "Get Delivered",
    description: "Track your delivery in real-time to your door.",
  },
  {
    icon: CheckCircle2,
    title: "Enjoy",
    description: "Fresh, hot meals—right when you want them.",
  },
]

export function HowItWorksSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Floating blurred shapes like FeaturesSection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            How It <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple steps to get your meal delivered fast.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-105 bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary/10 ${
                  mounted ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardContent className="p-8 text-center relative z-10">
                  {/* Icon */}
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 group-hover:text-primary transition-colors duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {step.description}
                  </p>
                </CardContent>

                {/* Bottom glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
