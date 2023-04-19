import Express, { RequestHandler } from "express";
import createError from "http-errors";
import UsersModel from "./model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { createAccessToken } from "../../lib/auth/tools";
import { UserRequest } from "../../interfaces/IAuth";
import { checkUserSchema, generateBadRequest } from "./validation";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Params } from "express-serve-static-core";
import createHttpError from "http-errors";

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
        `${process.env.FE_URL}/main/?accessToken=${req.user!.accessToken}`
      );
      // res.send(req.user!.accessToken);
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

usersRouter.post(
  "/session",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await UsersModel.checkCredentials(email, password);
      if (user) {
        const payload = { _id: user._id };
        const accessToken = await createAccessToken(payload);
        res.send({ accessToken, user });
      } else {
        next(createHttpError(401, "Credentials are not valid."));
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req: any, res, next) => {
  try {
    const user = await UsersModel.findById(req.user!._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/me", JWTAuthMiddleware, async (req: any, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user!._id,
      req.body,
      { new: true, runValidators: true }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "fs0522/whatsapp-avatars",
    } as Params,
  }),
}).single("avatar");

usersRouter.post(
  "/me/avatar",
  JWTAuthMiddleware,
  cloudinaryUploader,
  async (req: any, res, next) => {
    try {
      const user = await UsersModel.findByIdAndUpdate(
        req.user!._id,
        { ...req.body, avatar: req.file.path },
        { new: true, runValidators: true }
      );
      // avatar: req.file.path
      res.send({ user });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
