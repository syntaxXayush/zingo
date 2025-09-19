import { useEffect, useState, useCallback } from "react";

export default function useCurrentLocation() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const GEOAPIFY_API_KEY = "812d749999de462e9df7ca070383975b"; // apna API key

  // Reverse geocode with Geoapify
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await res.json();

      const props = data?.features?.[0]?.properties || {};
      const fullAddress =
        [
          props.address_line1,
          props.address_line2,
          props.city,
          props.state,
          props.postcode,
          props.country,
        ]
          .filter(Boolean)
          .join(", ") || "Unknown Location";

      setAddress(fullAddress);
    } catch (err) {
      console.error("Geoapify reverse geocode failed:", err);
      setAddress("Unable to fetch address");
    }
  }, [GEOAPIFY_API_KEY]);

  // Core GPS location
  const getCurrentLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported by this browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocation({ lat, lng });
        reverseGeocode(lat, lng);
        setLoading(false);
      },
      (err) => {
        console.error("GPS failed:", err);
        handleGeoError(err);
        setLocation({ lat: null, lng: null });
      },
      {
        enableHighAccuracy: true, // ✅ GPS chip use kare
        timeout: 30000,           // ⏱ 30s tak wait karo
        maximumAge: 60000,        // ✅ 1 min tak cache use karo (performance better)
      }
    );
  }, [reverseGeocode]);

  const handleGeoError = (err) => {
    if (err.code === 1) setError("Permission denied by user.");
    else if (err.code === 2) setError("Location unavailable.");
    else if (err.code === 3) setError("Request timed out. Please ensure location services are enabled, allow location access, and try again. If indoors or on desktop, accuracy may be limited.");
    else setError("Unable to get location.");
    setLoading(false);
  };

  useEffect(() => {
    getCurrentLocation();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        getCurrentLocation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [getCurrentLocation]);

  // Helper component for retry button and error display
  const LocationErrorFallback = ({ onRetry }) => (
    <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>
      <div>{error}</div>
      <button
        onClick={onRetry}
        style={{
          marginTop: 8,
          padding: '6px 16px',
          background: '#ff4d2d',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Try Again
      </button>
    </div>
  );

  return {
    location,
    address,
    loading,
    error,
    getCurrentLocation,
    setLocation,
    reverseGeocode,
    LocationErrorFallback,
  };
}
