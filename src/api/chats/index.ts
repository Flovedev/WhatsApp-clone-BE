import express from "express";
import ChatsSchema from "./model";
import ChatsModel from "./model";
import UsersModel from "../users/model";
import createHttpError from "http-errors";

const chatsRouter = express.Router();

chatsRouter.post("/:senderId/:reciverId", async (req, res, next) => {
  try {
    const checkForSender = await UsersModel.findById(req.params.senderId);
    if (!checkForSender) {
      next(
        createHttpError(404, `User with id ${req.params.senderId} not found!`)
      );
    }
    const checkForReciver = await UsersModel.findById(req.params.reciverId);
    if (!checkForReciver) {
      next(
        createHttpError(404, `User with id ${req.params.reciverId} not found!`)
      );
    }

    // const checkForChat = ChatsModel.findOne({
    //   users: { $all: [req.params.senderId, req.params.reciverId] },
    // });

    // if (checkForChat) {
    //   res.status(400).send("Chat already exists");
    // }
    const chat = new ChatsModel({
      users: [req.params.senderId, req.params.reciverId],
      messages: [],
    });
    const savedChat = await chat.save();
    res.status(201).send("Chat created");
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
