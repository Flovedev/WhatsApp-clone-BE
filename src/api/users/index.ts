import Express from "express";
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
      //   res.redirect(
      //     `${process.env.FE_URL}?accessToken=${req.user!.accessToken}`
      //   );
      res.send(req.user!.accessToken);
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

export default usersRouter;
