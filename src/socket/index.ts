import { Socket } from "socket.io";

export const newConnectionHandler = (socket: Socket) => {
  console.log("A new client connected! Id:", socket.id);
};
