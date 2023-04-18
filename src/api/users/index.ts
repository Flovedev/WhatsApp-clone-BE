import Express, { RequestHandler } from "express";
import createError from "http-errors";
import UsersModel from "./model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { createAccessToken } from "../../lib/auth/tools";
import { UserRequest } from "../../interfaces/IAuth";
import { checkUserSchema, generateBadRequest } from "./validation";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

const usersRouter = Express.Router();

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  (req: any, res: Response, next: NextFunction) => {
    try {
      res.redirect(
        `${process.env.FE_URL}/?accessToken=${req.user!.accessToken}`
      );
      //res.send(req.user!.accessToken);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/account",
  checkUserSchema,
  generateBadRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = new UsersModel(req.body);
      const { _id } = await newUser.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})


usersRouter.get("/me", JWTAuthMiddleware, async (req: any, res, next) => {
  try {
    const user = await UsersModel.findById(req.user!._id)
    res.send(user)
  } catch (error) {
    next(error)
  }
})


usersRouter.put("/me", JWTAuthMiddleware, async (req: any, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(req.user!._id, req.body, { new: true, runValidators: true })
    res.send(updatedUser)
  } catch (error) {
    next(error)
  }
})

export default usersRouter;
