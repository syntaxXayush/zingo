import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../utils/config'
import { useSelector } from 'react-redux'

function useUpdateLocation() {
const {userData,socket}=useSelector(state=>state.user)
useEffect(() => {
  async function updateMyLocation(lat, lng) {
    try {
      // Ensure coordinates are numbers
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid coordinates:", lat, lng);
        return;
      }

      // API call
      await axios.post(serverUrl + "/api/user/update-location", {
        latitude,
        longitude
      }, { withCredentials: true });

      // Socket emit
      socket?.emit("user:location:update", {
        latitude,
        longitude
      });
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  }

  // Har thodi der me location bhejna
  navigator.geolocation.watchPosition(
    (pos) => {
      updateMyLocation(pos.coords.latitude, pos.coords.longitude);
    },
    (err) => console.error(err),
    { enableHighAccuracy: false }
  );
}, [userData, socket]);
}

export default useUpdateLocation
