import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import home from "../assets/home.png";
import scooter from "../assets/scooter.png";

// ✅ Custom icons
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function DeliveryBoyTracking({ currentOrder }) {
  if (!currentOrder)
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-white/80 via-primary/5 to-white/80 backdrop-blur-xl rounded-2xl shadow-md animate-fade-in" 
        style={{
          boxShadow: "0 4px 16px rgba(31,38,135,0.08)",
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="text-primary text-lg font-semibold animate-fade-in">
          No active order right now
        </p>
      </div>
    );

  // ✅ Get coords safely
  const deliveryLat = currentOrder?.deliveryBoyLocation?.lat;
  const deliveryLng = currentOrder?.deliveryBoyLocation?.lng;
  const customerLat = currentOrder?.customer?.lat;
  const customerLng = currentOrder?.customer?.lng;

  const center =
    deliveryLat && deliveryLng ? [deliveryLat, deliveryLng] : [28.6139, 77.209];

  // ✅ Path between delivery boy and customer
  const path =
    deliveryLat && deliveryLng && customerLat && customerLng
      ? [
          [deliveryLat, deliveryLng],
          [customerLat, customerLng],
        ]
      : [];

  return (
    <div
      className="w-full h-[400px] mt-3 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white/90 via-primary/5 to-white/90 backdrop-blur-xl animate-fade-in"
      style={{
        boxShadow: "0 4px 20px rgba(31,38,135,0.12)",
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
      }}
    >
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Delivery Boy Marker */}
        {deliveryLat && deliveryLng && (
          <Marker position={[deliveryLat, deliveryLng]} icon={deliveryBoyIcon}>
            <Popup>Delivery Partner</Popup>
          </Marker>
        )}

        {/* Customer Marker */}
        {customerLat && customerLng && (
          <Marker position={[customerLat, customerLng]} icon={customerIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Path */}
        {path.length > 0 && (
          <Polyline
            positions={path}
            color="#3b82f6" // Tailwind blue-500
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
}
