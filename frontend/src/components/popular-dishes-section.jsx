import FoodCard from "./FoodCard"
import homeImg from "../assets/home.png"

const mockItems = [
  {
    _id: "1",
    name: "Margherita Pizza",
    price: 299,
    image: homeImg,
    type: "veg",
    rating: { average: 4, count: 120 },
    shop: "Popular Pizza",
  },
  {
    _id: "2",
    name: "Spicy Burger",
    price: 199,
    image: homeImg,
    type: "non-veg",
    rating: { average: 5, count: 86 },
    shop: "Burger Hub",
  },
  {
    _id: "3",
    name: "Pasta Alfredo",
    price: 249,
    image: homeImg,
    type: "veg",
    rating: { average: 4, count: 64 },
    shop: "Pasta Place",
  },
  {
    _id: "4",
    name: "Paneer Tikka",
    price: 279,
    image: homeImg,
    type: "veg",
    rating: { average: 5, count: 142 },
    shop: "Spice Route",
  },
  {
    _id: "5",
    name: "Chicken Biryani",
    price: 329,
    image: homeImg,
    type: "non-veg",
    rating: { average: 5, count: 210 },
    shop: "Biryani House",
  },
  
]

export function PopularDishesSection({ items = mockItems }) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5" />

      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
            Popular{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dishes</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hand-picked favorites loved by our customers, crafted with passion and served with love.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-items-center">
          {items.map((item, index) => (
            <div
              key={item._id}
              className="group w-full max-w-sm transform transition-all duration-500 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <FoodCard data={item} />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full backdrop-blur-sm border border-primary/20">
            <span className="text-muted-foreground">Can't find what you're looking for?</span>
            <button className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
              View All Dishes
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PopularDishesSection

