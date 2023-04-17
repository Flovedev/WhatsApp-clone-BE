import { Model, Document } from "mongoose"

interface User {
    username: string
    email: string,
    password: string,
    avatar?: string
}

export interface UserDocument extends User, Document { }

export interface UserModel extends Model<UserDocument> {
    checkCredentials(email: string, password: string): Promise<UserDocument | null>
}