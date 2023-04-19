import express from "express";
import { Request, Response, NextFunction } from "express";
import ChatsSchema from "./model";
import ChatsModel from "./model";
import UsersModel from "../users/model";
import createHttpError from "http-errors";

const chatsRouter = express.Router();

chatsRouter.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const checkForUser = await UsersModel.findById(req.params.userId);
      if (!checkForUser) {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }

      const findChats = await ChatsModel.find({
        users: { $in: [req.params.userId] },
      });
      if (findChats.length > 0) {
        res.send(findChats);
      } else {
        res.send({ message: "No chats created with this user yet!" });
      }
    } catch (error) {
      next(error);
    }
  }
);

chatsRouter.post("/", async (req, res, next) => {
  try {
    const users = req.body.users;

    if (!Array.isArray(users) || users.length !== 2) {
      next(createHttpError(400, "users array must contain 2 usersId"));
    }

    const user1 = users[0];
    const user2 = users[1];

    const checkForFirstId = await UsersModel.findById(user1);
    if (!checkForFirstId) {
      next(createHttpError(404, `User with id ${user1} not found!`));
    }
    const checkForSecondtId = await UsersModel.findById(user2);
    if (!checkForSecondtId) {
      next(createHttpError(404, `User with id ${user2} not found!`));
    }

    if (user1 === user2) {
      next(createHttpError(404, "The usersId must be different!"));
    }

    const checkForChat = await ChatsModel.findOne({
      users: { $all: [user1, user2] },
    });

    if (checkForChat) {
      res.status(400).send({ message: "Chat already exists" });
    } else {
      const chat = new ChatsModel({
        users: [user1, user2],
        messages: [],
      });
      const savedChat = await chat.save();
      res.status(201).send(savedChat);
    }
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
