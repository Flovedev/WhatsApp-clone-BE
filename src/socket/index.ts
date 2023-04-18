import { Socket } from "socket.io";
import { UserIo } from "../interfaces/ISocketIo";

let onlineUsers = <UserIo[]>[];

export const newConnectionHandler = (socket: Socket) => {
  console.log("A new client connected! Id:", socket.id);

  socket.emit("welcome", { message: `Hello, ${socket.id}` });

  socket.on("setUsername", (payload) => {
    console.log(payload);

    onlineUsers.push({ username: payload.username, socketId: socket.id });

    socket.emit("loggedIn", onlineUsers);

    socket.broadcast.emit("updateOnlineUserList", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    socket.broadcast.emit("newMessage", message);
  });

  // socket.on("disconnect", () => {
  //   onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

  //   socket.broadcast.emit("updateOnlineUsersList", onlineUsers);
  // });
};
