// src/hooks/useCurrentUser.js
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../utils/config";

function useCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        // console.log(result.data);
        dispatch(setUserData(result.data));
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchUsers();
  }, [dispatch]);
}

export default useCurrentUser;
