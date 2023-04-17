import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";
import { RequestHandler } from "express"


const userSchema = {
    name: {
        in: "body",
        isString: {
            errorMessage: "Name is a mandatory field and needs to be a string!",
        },
    },
    email: {
        in: "body",
        isString: {
            errorMessage: "Email is a mandatory field and needs to be a string!",
        },
    },
    password: {
        in: "body",
        isString: {
            errorMessage: "Password is a mandatory field and needs to be a string!",
        },
    }
}
export const checkUserSchema = checkSchema(userSchema)


export const generateBadRequest: RequestHandler = (request, response, next) => {
    const errors = validationResult(request)

    if (errors.isEmpty()) {
        next()
    } else {
        next(createHttpError(400, "Errors during user validation", { errorsList: errors.array() }))
    }
}