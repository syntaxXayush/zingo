
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import axios from "axios";
import { serverUrl } from "../utils/config";



// Pulse animation for delivery boy marker
const deliveryBoyPulseIcon = L.divIcon({
  className: '',
  html: `
    <div style="position: relative; width: 40px; height: 40px;">
      <img src="${scooter}" style="width: 40px; height: 40px; position: absolute; z-index: 2; left: 0; top: 0;" />
      <span class="delivery-pulse"></span>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Add pulse CSS to document head if not already present
if (typeof window !== 'undefined' && !document.getElementById('delivery-pulse-style')) {
  const style = document.createElement('style');
  style.id = 'delivery-pulse-style';
  style.innerHTML = `
    .delivery-pulse {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 32px;
      height: 32px;
      background: rgba(255, 77, 45, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      animation: delivery-pulse-anim 1.2s infinite cubic-bezier(0.66,0,0,1);
    }
    @keyframes delivery-pulse-anim {
      0% { transform: translate(-50%, -50%) scale(0.7); opacity: 0.7; }
      70% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.2; }
      100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Haversine formula to calculate distance between two lat/lng points in km
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * UserDeliveryTracking component
 * @param {string|number} orderId
 * @param {string|number} shopOrderId
 * @param {{lat: number, lng: number}} userLocation
 */
const UserDeliveryTracking = ({ orderId, shopOrderId, userLocation }) => {
  const [deliveryLoc, setDeliveryLoc] = useState(null);
  const socket = useSelector((state) => state.user.socket);
  // Optionally: const [eta, setEta] = useState(null); // For ETA improvement

  useEffect(() => {
    let interval;
    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/delivery-location/${orderId}/${shopOrderId}`,
          { withCredentials: true }
        );
        if (res.data.success && res.data.deliveryBoyLocation) {
          setDeliveryLoc(res.data.deliveryBoyLocation);
        }
      } catch (err) {
        console.error("Error fetching delivery boy location:", err);
      }
    };

    if (socket) {
      const handler = (data) => {
        if (
          data.orderId === orderId &&
          data.shopOrderId === shopOrderId &&
          data.latitude && data.longitude
        ) {
          setDeliveryLoc({ lat: data.latitude, lng: data.longitude });
        }
      };
      socket.on("delivery:locationUpdate", handler);
      fetchLocation();
      return () => socket.off("delivery:locationUpdate", handler);
    } else {
      fetchLocation();
      interval = setInterval(fetchLocation, 5000);
      return () => clearInterval(interval);
    }
  }, [orderId, shopOrderId, socket]);

  if (!deliveryLoc) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 animate-fade-in">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-center text-xl text-pink-500 font-semibold">Loading map...</p>
      </div>
    );
  }

  const polylinePath = [
    [deliveryLoc.lat, deliveryLoc.lng],
    [userLocation.lat, userLocation.lng],
  ];

  const center = [
    (deliveryLoc.lat + userLocation.lat) / 2,
    (deliveryLoc.lng + userLocation.lng) / 2,
  ];

  // Status message and ETA
  const statusMsg = "Your order is on the way!";
  let etaMsg = null;
  if (deliveryLoc && userLocation) {
    const distanceKm = getDistanceKm(deliveryLoc.lat, deliveryLoc.lng, userLocation.lat, userLocation.lng);
    const speedKmh = 30; // Assume 30 km/h average speed
    const etaMin = Math.round((distanceKm / speedKmh) * 60);
    if (!isNaN(etaMin) && etaMin >= 0) {
      etaMsg = `Estimated arrival: ${etaMin} min`;
    }
  }

  return (
    <div>
      <div className="text-center text-lg font-bold text-pink-600 mb-1 animate-fade-in">
        {statusMsg}
      </div>
      {etaMsg && (
        <div className="text-center text-sm text-gray-500 mb-2 animate-fade-in">
          {etaMsg}
        </div>
      )}
      <div className="w-full h-[420px] rounded-3xl overflow-hidden shadow-2xl mt-6 bg-gradient-to-br from-white/80 via-primary/10 to-white/80 backdrop-blur-xl border border-pink-500/20 animate-fade-in" style={{boxShadow:'0 4px 24px 0 rgba(31,38,135,0.10)'}}>
        <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Delivery boy marker with pulse animation */}
          <Marker position={[deliveryLoc.lat, deliveryLoc.lng]} icon={deliveryBoyPulseIcon}>
            <Popup>
              <span className="font-extrabold text-pink-500">Delivery Boy</span>
            </Popup>
          </Marker>

          {/* User marker */}
          <Marker position={[userLocation.lat, userLocation.lng]} icon={customerIcon}>
            <Popup>
              <span className="font-extrabold text-yellow-400">Your Address</span>
            </Popup>
          </Marker>

          {/* Route line */}
          <Polyline positions={polylinePath} color="#ff4d2d" weight={6} />
        </MapContainer>
      </div>
    </div>
  );
};

export default UserDeliveryTracking;


