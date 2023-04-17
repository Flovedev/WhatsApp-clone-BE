import Express from "express"
import createError from "http-errors"
import UsersModel from "./model"
import { JWTAuthMiddleware } from "../../lib/auth/jwt"
import { createAccessToken } from "../../lib/auth/tools"
import { UserRequest } from "../../interfaces/IAuth"
import { checkUserSchema, generateBadRequest } from "./validation"
import { Request, Response, NextFunction } from "express"

const usersRouter = Express.Router()

usersRouter.post("/account", checkUserSchema, generateBadRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = new UsersModel(req.body)
        const { _id } = await newUser.save()
        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

export default usersRouter