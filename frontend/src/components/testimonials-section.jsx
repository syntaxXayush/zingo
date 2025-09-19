"use client"

import { Card, CardContent } from "./ui/card"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Food Enthusiast",
    avatar: "/professional-woman-headshot.png",
    rating: 5,
    text: "Zingo has completely changed how I order food. The delivery is always on time and the food arrives hot!",
  },
  {
    name: "Mike Chen",
    role: "Busy Professional",
    avatar: "/professional-man-headshot.png",
    rating: 5,
    text: "As someone who works long hours, Zingo is a lifesaver. Quick, reliable, and the app is so easy to use.",
  },
  {
    name: "Emily Rodriguez",
    role: "College Student",
    avatar: "/college-student-headshot.jpg",
    rating: 5,
    text: "The variety of restaurants is amazing and the student discounts make it affordable. Highly recommend!",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />

      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-lg animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Customers
            </span>{" "}
            Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real reviews from happy users who love our service.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group overflow-hidden">
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="p-10 text-center relative z-10">
                      <div className="flex justify-center mb-8">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow-sm animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>

                      <blockquote className="text-xl md:text-2xl text-foreground/90 mb-8 leading-relaxed font-medium relative">
                        <span className="text-primary/30 text-6xl absolute -top-4 -left-2">"</span>
                        {testimonial.text}
                        <span className="text-primary/30 text-6xl absolute -bottom-8 -right-2">"</span>
                      </blockquote>

                      <div className="flex items-center justify-center gap-6">
                        <div className="relative">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20 shadow-lg"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground font-medium">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-10 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary shadow-lg scale-125"
                    : "bg-muted hover:bg-muted-foreground/50 hover:scale-110"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
