import jwt from "jsonwebtoken"
import { TokenPayload } from "../../interfaces/IAuth"

export const createAccessToken = (payload: TokenPayload): Promise<string> =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "1 week" }, (err, token) => {
            if (err) reject(err)
            else resolve(token as string)
        })
    )

export const verifyAccessToken = (token: string): Promise<TokenPayload> =>
    new Promise((resolve, reject) =>
        jwt.verify(token, process.env.SECRET_KEY!, (err, payload) => {
            if (err) reject(err)
            else resolve(payload as TokenPayload)
        })
    ) 