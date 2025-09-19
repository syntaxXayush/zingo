import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Check, Crown, Zap } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for occasional orders",
    icon: Zap,
    features: ["Standard delivery", "Basic customer support", "Order tracking", "Multiple payment options"],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Zingo Plus",
    price: "$9.99/month",
    description: "Best value for regular users",
    icon: Crown,
    features: [
      "Free delivery on orders over $15",
      "Priority customer support",
      "Advanced order tracking",
      "Exclusive restaurant deals",
      "5% cashback on all orders",
      "No surge pricing",
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
]

export function PricingSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/20 dark:via-emerald-950/10 dark:to-teal-950/20" />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/30 dark:bg-green-800/20 rounded-full blur-xl animate-float" />
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-24 h-24 bg-teal-200/25 dark:bg-teal-800/15 rounded-full blur-xl animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-balance">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Simple pricing for every kind of eater.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <Card
                key={index}
                className={`
                  relative group cursor-pointer transition-all duration-500 ease-out
                  ${
                    plan.popular
                      ? "bg-gradient-to-br from-white/90 via-green-50/80 to-emerald-50/70 dark:from-gray-900/90 dark:via-green-950/50 dark:to-emerald-950/30 border-green-200/50 dark:border-green-800/30 shadow-xl shadow-green-500/10 dark:shadow-green-400/5"
                      : "bg-white/80 dark:bg-gray-900/80 border-border/50"
                  }
                  backdrop-blur-sm rounded-2xl
                  hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20 dark:hover:shadow-green-400/10
                  hover:-translate-y-1
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-sm opacity-75" />
                      <div className="relative text-xs px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <div
                    className={`
                    inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300
                    ${
                      plan.popular
                        ? "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-600 dark:text-green-400 shadow-lg shadow-green-500/25"
                        : "bg-primary/10 text-primary"
                    }
                    group-hover:scale-110 group-hover:rotate-3
                  `}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  <CardTitle className="text-2xl font-semibold mb-2">{plan.name}</CardTitle>

                  <div
                    className={`
                    text-3xl font-bold mb-2
                    ${
                      plan.popular
                        ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
                        : "text-primary"
                    }
                  `}
                  >
                    {plan.price}
                  </div>

                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3 group/item"
                        style={{ animationDelay: `${featureIndex * 100}ms` }}
                      >
                        <div
                          className={`
                          flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300
                          ${
                            plan.popular
                              ? "bg-green-100 dark:bg-green-900/50 group-hover/item:bg-green-200 dark:group-hover/item:bg-green-800/50"
                              : "bg-primary/10 group-hover/item:bg-primary/20"
                          }
                        `}
                        >
                          <Check
                            className={`
                            h-3 w-3 transition-all duration-300
                            ${plan.popular ? "text-green-600 dark:text-green-400" : "text-primary"}
                          `}
                          />
                        </div>
                        <span className="text-sm text-foreground group-hover/item:text-foreground/80 transition-colors duration-200">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`
                      w-full transition-all duration-300 group-hover:scale-[1.02]
                      ${
                        plan.popular
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
                          : ""
                      }
                    `}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
