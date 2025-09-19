import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { MdDeliveryDining, MdKeyboardBackspace } from "react-icons/md";
import { FaMapMarkerAlt, FaCreditCard, FaMobileAlt, FaSearch, FaCrosshairs } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../utils/config";
import useCurrentLocation from "../hooks/useCurrentLocation";

const GEOAPIFY_API_KEY = "812d749999de462e9df7ca070383975b";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 20, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

export default function CheckoutPage() {
  const { cartItems, userData } = useSelector((s) => s.user);
  const {
    location,
    address,
    loading,
    error,
    getCurrentLocation,
    setLocation,
    reverseGeocode,
    LocationErrorFallback
  } = useCurrentLocation();

  const [method, setMethod] = useState("cod"); // Default to COD since online payment is having issues
  const [searchText, setSearchText] = useState("");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [flat, setFlat] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (address) setSearchText(address);
  }, [address]);

  const subtotal = cartItems.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  // 🔥 Forward Geocoding
  const forwardGeocode = async (addr) => {
    if (typeof addr !== "string" || !addr.trim()) return;
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addr
        )}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const { lat, lon } = data.features[0].properties;
        const display_name = data.features[0].properties.formatted;

        setLocation({ lat, lng: lon });
        reverseGeocode(lat, lon);
        setSearchText(display_name);
      }
    } catch (err) {
      console.error("Geoapify forward geocode failed:", err);
    }
  };

  const onDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setLocation({ lat, lng });
    reverseGeocode(lat, lng);
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!searchText.trim()) newErrors.address = "Address is required";
    if (!flat.trim()) newErrors.flat = "Flat/House No. is required";
    if (!pincode.trim() || !/^\d{6}$/.test(pincode)) newErrors.pincode = "Valid 6-digit pincode required";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) newErrors.phone = "Valid 10-digit phone required";
    return newErrors;
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/placeorder`,
        {
          address: { text: searchText, flat, landmark, pincode, latitude: location.lat, longitude: location.lng },
          phone,
          paymentMethod: method,
          cartItems
        },
        { withCredentials: true }
      );

      const orderId = res.data.orderId;
      if (method === "cod") {
        navigate("/order-placed");
      } else {
        openRazorpay(orderId, res.data.razorOrder);
      }
    } catch (error) {
      console.error(error);
      alert("Order failed!");
    }
  };

  const openRazorpay = (orderId, razorpayOrder) => {
    // Check if Razorpay is available
    if (!window.Razorpay) {
      alert("Razorpay is not available. Please use Cash on Delivery instead.");
      return;
    }

    const options = {
      key: "rzp_test_R8OFNIx0dn0Ggd", // This key appears to be invalid
      amount: razorpayOrder?.amount,
      currency: "INR",
      name: "Zingo",
      description: "Order Payment",
      order_id: razorpayOrder?.id,
      handler: async function (response) {
        try {
          await axios.post(
            `${serverUrl}/api/order/verify-razorpay`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId
            },
            { withCredentials: true }
          );
          navigate("/order-placed");
        } catch (err) {
          console.error("Payment verify failed", err);
          alert("Payment verification failed!");
        }
      },
      prefill: {
        name: userData?.name,
        email: userData?.email,
        contact: userData?.phone
      },
      theme: { color: "#2563eb" }, // primary blue
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again or use Cash on Delivery.");
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization failed:", error);
      alert("Payment system is currently unavailable. Please use Cash on Delivery instead.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-10">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-10 cursor-pointer" onClick={() => navigate("/")}>
        <MdKeyboardBackspace className="w-8 h-8 text-primary hover:scale-110 transition-transform" />
      </div>

      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 space-y-10 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>

        {/* Location Section */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <FaMapMarkerAlt className="text-primary" /> Delivery Location
          </h2>

          {/* Address Inputs */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl p-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter your delivery address"
              />
              <button
                onClick={() => forwardGeocode(searchText)}
                className="bg-primary text-white px-4 py-3 rounded-xl hover:bg-primary/90 transition"
              >
                <FaSearch />
              </button>
              <button
                onClick={getCurrentLocation}
                className="bg-gray-800 text-white px-4 py-3 rounded-xl hover:bg-gray-900 transition"
                title="Use my current location"
              >
                <FaCrosshairs />
              </button>
            </div>
            {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}

            <input
              type="text"
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Flat / House No."
            />
            {errors.flat && <span className="text-red-500 text-sm">{errors.flat}</span>}

            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Landmark (optional)"
            />

            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="border border-gray-300 rounded-xl p-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Pincode"
            />
            {errors.pincode && <span className="text-red-500 text-sm">{errors.pincode}</span>}

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              className="border border-gray-300 rounded-xl p-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Phone Number"
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
          </div>

          {/* Map */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-64 w-full flex items-center justify-center">
              {loading ? (
                <p className="text-primary font-medium">Fetching current location...</p>
              ) : error ? (
                <LocationErrorFallback onRetry={getCurrentLocation} />
              ) : typeof location.lat === "number" && typeof location.lng === "number" ? (
                <MapContainer className="h-full w-full" center={[location.lat, location.lng]} zoom={17} scrollWheelZoom={false}>
                  <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Recenter lat={location.lat} lng={location.lng} />
                  <Marker position={[location.lat, location.lng]} draggable eventHandlers={{ dragend: onDragEnd }}>
                    <Popup>Drag to adjust location</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p className="text-primary font-medium">Location not available</p>
              )}
            </div>
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* COD */}
            <button
              type="button"
              onClick={() => setMethod("cod")}
              className={`flex items-center gap-4 rounded-xl border p-5 text-left transition font-medium text-base ${
                method === "cod" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className="font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when your food arrives</p>
              </div>
            </button>

            {/* Online - Temporarily Disabled */}
            <button
              type="button"
              onClick={() => {
                alert("Online payment is temporarily unavailable. Please use Cash on Delivery.");
                setMethod("cod");
              }}
              className="flex items-center gap-4 rounded-xl border p-5 text-left transition font-medium text-base border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileAlt className="text-purple-700 text-xl" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-xl" />
              </span>
              <div>
                <p className="font-semibold text-gray-800">UPI / Credit / Debit Card</p>
                <p className="text-sm text-gray-500">Temporarily unavailable - Use COD</p>
              </div>
            </button>
          </div>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-3 shadow-sm">
            {cartItems.map((it) => (
              <div key={it.id} className="flex justify-between text-base text-gray-700 font-medium">
                <span>
                  {it.name} × {it.quantity}
                </span>
                <span>₹{(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="border-gray-200 my-2" />
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <button
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg shadow hover:bg-primary/90 transition"
          onClick={handlePlaceOrder}
        >
          {method === "cod" ? "Place Order" : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}
