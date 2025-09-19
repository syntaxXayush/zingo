"use client"

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "../components/ui/button"

export function Footer() {
  return (
    <footer className="w-full relative overflow-hidden bg-background text-foreground">
      {/* Background floating blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-10 w-28 h-28 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        {/* Twinkling stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
                <span className="font-extrabold text-2xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Zingo</h3>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              The fastest and most reliable food delivery service. Get your favorite meals delivered hot and fresh in minutes.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Facebook className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Twitter className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Instagram className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Youtube className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3 text-base">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Restaurants</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Become a Partner</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-3 text-base">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Download App */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Download App</h4>
            <p className="text-muted-foreground text-base">
              Get the Zingo app for faster ordering and exclusive deals.
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-primary/80 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform">
                📱 Download for iOS
              </Button>
              <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform">
                🤖 Download for Android
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/40 mt-10 pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-muted-foreground text-base">
              © 2025 Zingo Food Delivery. All rights reserved.
            </p>
            <div className="flex space-x-8 text-base font-semibold">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
