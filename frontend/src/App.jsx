import React, { useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import EditShop from "./pages/EditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem"; // ✅ fixed case-sensitive import
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import PendingOrders from "./pages/PendingOrders";
import TrackOrderPage from "./pages/TrackOrderPage";
import MyDeliveredOrders from "./pages/MyDeliveredOrders";
import ShopItems from "./pages/ShopItems";

import { HeroSection } from "./components/hero-section";
import { FeaturesSection } from "./components/features-section";
import { FinalCTASection } from "./components/final-cta-section";
import { HowItWorksSection } from "./components/how-it-works-section";
import { PopularDishesSection } from "./components/popular-dishes-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { PricingSection } from "./components/pricing-section";
import { Footer } from "./components/Footer";

// ✅ Import hooks (not plain functions)
import useCurrentUser from "./hooks/getCurrentUser";
import useCity from "./hooks/getCity";
import useCurrentShop from "./hooks/getCurrentShop";
import useShopsByCity from "./hooks/getShopsByCity";
import useItemsByCity from "./hooks/getItemsByCity";
import useOwnerPendingOrders from "./hooks/getOwnerPendingOrders";
import useUpdateLocation from "./hooks/updateLocation";

import { setSocket } from "./redux/userSlice";
import { serverUrl } from "./utils/config";

function App() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  // ✅ Call custom hooks directly at top
  useCurrentUser();
  useCity();
  useCurrentShop();
  useShopsByCity();
  useItemsByCity();
  useOwnerPendingOrders();
  useUpdateLocation();

  // ✅ Create socket once
  useEffect(() => {
    if (!socketRef.current) {
      const socketInstance = io(serverUrl, { 
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000
      });
      socketRef.current = socketInstance;
      dispatch(setSocket(socketInstance));

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      socketInstance.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected after", attemptNumber, "attempts");
      });

      return () => {
        socketInstance.disconnect();
        socketRef.current = null;
      };
    }
  }, [dispatch]);

  // ✅ Identify after user loads/changes
  useEffect(() => {
    if (socketRef.current && userData?._id) {
      socketRef.current.emit("identify", { userId: userData._id });
    }
  }, [userData?._id]);

  return (
    <>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <HowItWorksSection />
              <FeaturesSection />
              <PopularDishesSection />
              <TestimonialsSection />
              <PricingSection />
              <FinalCTASection />
              <Footer /> {/* ✅ Footer at bottom */}
            </>
          }
        />

        {/* Auth Pages */}
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/home"} />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to={"/home"} />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to={"/home"} />}
        />

        {/* User Pages */}
        <Route
          path="/home"
          element={userData ? <Home /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/editshop"
          element={userData ? <EditShop /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/additem"
          element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/edititem/:itemId"
          element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/cart"
          element={userData ? <CartPage /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/checkout"
          element={userData ? <CheckoutPage /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/order-placed"
          element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/my-orders"
          element={userData ? <MyOrders /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/pending-orders"
          element={userData ? <PendingOrders /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/my-delivered-orders"
          element={userData ? <MyDeliveredOrders /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/track-order/:orderId"
          element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/shop-items/:shopId"
          element={userData ? <ShopItems /> : <Navigate to={"/signin"} />}
        />
      </Routes>
    </>
  );
}

export default App;
