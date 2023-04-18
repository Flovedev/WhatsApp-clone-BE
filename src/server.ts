import Express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers";
import { newConnectionHandler } from "./socket/index";
import usersRouter from "./api/users";
import chatsRouter from "./api/chats";
import passport from "passport";
import googleStrategy from "./lib/auth/googleOauth";

const expressServer = Express();

// SOCKET.IO
const httpServer = createServer(expressServer);
const socketioServer = new Server(httpServer);

socketioServer.on("connection", newConnectionHandler);

passport.use("google", googleStrategy);

//MIDDLEWARES
expressServer.use(cors());
expressServer.use(Express.json());

expressServer.use(passport.initialize());

//ENDPOINTS
expressServer.use("/users", usersRouter);
expressServer.use("/chats", chatsRouter);

//ERROR HANDLERS
expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);

export { httpServer, expressServer };
