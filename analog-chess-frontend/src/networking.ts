import { io } from "socket.io-client";
import { Piece, GamePosition } from "./types";

// create a new socket
const socket = io("http://localhost:5000");

// connect to the socket
socket.on("connect", () => {
  console.log("connected to server");
});

// send a message to the server
export function boop() {
  socket.emit("message", "boop");
}

export function broadcastMove(piece: Piece, location: GamePosition) {
  socket.emit("move", { piece, location });
}
