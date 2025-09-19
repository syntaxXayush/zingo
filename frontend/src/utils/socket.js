// Simple socket.io client singleton for notifications and real-time events
import { io } from "socket.io-client";
import { serverUrl } from "./config";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(serverUrl, {
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
}
