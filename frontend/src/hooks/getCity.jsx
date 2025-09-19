import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity } from "../redux/userSlice";

function useGetCity() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.log("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        try {
          // 🔑 apna Geoapify API key yaha lagao
          const apiKey = "812d749999de462e9df7ca070383975b";

          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
          );
          const data = await response.json();

          const props = data?.features?.[0]?.properties || {};
          let city =
            props.city ||
            props.town ||
            props.village ||
            props.state ||
            "Unknown";

          // Prefer Kolkata if in West Bengal and city is South Dumdum or similar
          if (
            props.state === "West Bengal" &&
            ["South Dumdum", "North Dumdum", "Baranagar", "Bidhannagar", "Howrah", "Bally", "Unknown"].includes(city)
          ) {
            city = "Kolkata";
          }

          dispatch(setCity(city));
        } catch (err) {
          console.error("Error fetching city name:", err);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [dispatch]);
}

export default useGetCity;
