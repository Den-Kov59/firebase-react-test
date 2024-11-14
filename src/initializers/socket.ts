import { io } from "socket.io-client";

let socket = io(
  "https://firebase-backend-1-110679803978.europe-west4.run.app",
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
  }
);

const getSocket = () => {
  if (!socket) {
    socket = io(
      "https://firebase-backend-1-110679803978.europe-west4.run.app",
      {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
      }
    );
  }

  return socket;
};

export default getSocket;
