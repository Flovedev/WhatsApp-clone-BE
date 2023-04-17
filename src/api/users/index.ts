import Express from "express"
import createError from "http-errors"
import UsersModel from "./model"
import { JWTAuthMiddleware } from "../../lib/auth/jwt"
import { createAccessToken } from "../../lib/auth/tools"
import { UserRequest } from "../../interfaces/IAuth"


const usersRouter = Express.Router()

usersRouter.post("/account", async (req, res, next) => {
    try {
        const newUser = new UsersModel(req.body)
        const { _id } = await newUser.save()
        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

export default usersRouter