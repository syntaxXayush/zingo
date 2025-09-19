"use client"

import { Button } from "./ui/button"
import { ArrowRight, Download, Star, Sparkles } from "lucide-react"

export function FinalCTASection() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Background Decorations (same vibe as Hero) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500 transform -translate-x-1/2 -translate-y-1/2"></div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-10 animate-bounce delay-300">
          <div className="w-3 h-3 bg-primary/40 rounded-full"></div>
        </div>
        <div className="absolute top-32 right-20 animate-bounce delay-700">
          <Star className="w-5 h-5 text-primary/40" />
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce delay-1000">
          <Sparkles className="w-6 h-6 text-accent/50" />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-8 text-balance bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-tight drop-shadow-md">
          Get Zingo today & order your favorite food!
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
          Join millions of satisfied customers and experience the future of food delivery.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-14">
          <Button
            size="lg"
            className="text-lg px-10 py-7 group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Download className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
            Download App
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-10 py-7 group bg-background/80 backdrop-blur-sm border-2 hover:bg-accent/10 hover:border-primary/30 transition-all duration-300"
          >
            Order Now
            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>

        {/* Bottom Features */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 text-lg text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>Available on iOS & Android</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span>Free to download</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary/80 rounded-full" />
            <span>No hidden fees</span>
          </div>
        </div>
      </div>
    </section>
  )
}
