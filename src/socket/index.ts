import { Socket } from "socket.io";
import { UserIo } from "../interfaces/ISocketIo";
import MessageModel from "../api/message/model";
import ChatModel from "../api/chats/model";

let onlineUsers = <UserIo[]>[];

export const newConnectionHandler = (socket: Socket) => {
  console.log("A new client connected! Id:", socket.id);

  socket.emit("welcome", { message: `Hello, ${socket.id}` });

  // socket.on("setUsername", (payload) => {
  //   console.log(payload);

  //   onlineUsers.push({ username: payload.username, socketId: socket.id });

  //   socket.emit("loggedIn", onlineUsers);

  //   socket.broadcast.emit("updateOnlineUserList", onlineUsers);
  // });

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    socket.data.roomName = roomName;
  });

  socket.on("sendMessage", async (message) => {
    // socket.broadcast.emit("newMessage", message);
    console.log(message);

    const roomName = socket.data.roomName;
    socket.to(roomName).emit("newMessage", message);

    let newMessage = {
      sender: message.message.sender,
      content: {
        text: message.message.text,
      },
      createdAt: message.message.createdAt,
    };
    // console.log(newMessage);

    const updatedChat = await ChatModel.findByIdAndUpdate(
      message.message.chatId,
      { $push: { messages: newMessage } },
      { new: true, runValidators: true }
    );

    await updatedChat?.save();
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    socket.broadcast.emit("updateOnlineUsersList", onlineUsers);
  });
};
