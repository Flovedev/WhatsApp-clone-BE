import createHttpError from "http-errors"
import { RequestHandler } from "express"
import { verifyAccessToken } from "./tools"
import { UserRequest } from "../../interfaces/IAuth"

export const JWTAuthMiddleware: RequestHandler = async (req: UserRequest, res, next) => {
    if (!req.headers.authorization) {
        next(createHttpError(401, "Please provide Bearer token in authorization header"))
    } else {
        const accessToken = req.headers.authorization.replace("Bearer ", "")
        try {
            const payload = await verifyAccessToken(accessToken)

            req.user = { _id: payload._id }
            next()

        } catch (error) {
            console.log(error)
            next(createHttpError(401, "Token not valid! Please log in again!"))
        }
    }
}