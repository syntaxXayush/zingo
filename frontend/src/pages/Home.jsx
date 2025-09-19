import { useSelector } from "react-redux"
import UserDashboard from "../components/UserDashboard"
import DeliveryBoy from "../components/DeliveryBoy"
import OwnerDashboard from "../components/OwnerDashboard"
import { Footer } from "../components/Footer"

function Home() {
  const { userData } = useSelector((state) => state.user)

  return (
    <div
      className="w-screen min-h-screen pt-[100px] flex flex-col items-center 
      bg-gradient-to-br from-background via-background/95 to-primary/10 
      relative overflow-hidden"
    >
      {/* Floating Background Blobs (matching Features & HowItWorks) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl animate-float opacity-60" />
        <div
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-full blur-3xl animate-float opacity-50"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-20 w-48 h-48 bg-gradient-to-br from-accent/15 to-accent/5 rounded-full blur-3xl animate-float opacity-40"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-primary/25 to-primary/10 rounded-full blur-3xl animate-float opacity-70"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-secondary/20 to-secondary/8 rounded-full blur-3xl animate-float opacity-45"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-36 h-36 bg-gradient-to-br from-accent/20 to-accent/8 rounded-full blur-3xl animate-float opacity-55"
          style={{ animationDelay: "1.5s" }}
        />

        <div
          className="absolute top-60 left-1/2 w-16 h-16 bg-primary/10 rounded-full blur-2xl animate-float opacity-30"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-60 right-1/4 w-20 h-20 bg-secondary/10 rounded-full blur-2xl animate-float opacity-35"
          style={{ animationDelay: "2.5s" }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:50px_50px] opacity-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center animate-fade-in">
        <div className="text-center mb-8 px-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-4">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {userData?.role === "user" && "Discover delicious meals and track your orders"}
            {userData?.role === "owner" && "Manage your restaurant and grow your business"}
            {userData?.role === "deliveryBoy" && "View your delivery assignments and earnings"}
          </p>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
          <div className="backdrop-blur-sm bg-background/30 rounded-3xl border border-white/10 shadow-2xl p-1">
            {userData?.role === "user" && <UserDashboard />}
            {userData?.role === "owner" && <OwnerDashboard />}
            {userData?.role === "deliveryBoy" && <DeliveryBoy />}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full mt-16">
        <Footer />
      </div>
    </div>
  )
}

export default Home
