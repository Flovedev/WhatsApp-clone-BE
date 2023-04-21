import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument, UserModel } from "../../interfaces/IUser";

const { Schema, model } = mongoose;

const UsersSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    info: { type: String, default: "Hey there! I am using WhatsApp." },
    avatar: {
      type: String,
      default:
        "https://www.transparentpng.com/thumb/user/blue-male-user-profile-transparent-png-2lbgMx.png",
    },
  },
  { timestamps: true }
);

UsersSchema.pre("save", async function () {
  const newUserData = this;

  if (newUserData.isModified("password")) {
    const plainPW = newUserData.password;

    const hash = await bcrypt.hash(plainPW!, 11);
    newUserData.password = hash;
  }
});

UsersSchema.methods.toJSON = function () {
  const currentUserDocument = this;
  const currentUser = currentUserDocument.toObject();
  delete currentUser.password;
  delete currentUser.createdAt;
  delete currentUser.updatedAt;
  delete currentUser.__v;
  return currentUser;
};

UsersSchema.static("checkCredentials", async function (email, plainPW) {
  const user = await this.findOne({ email });

  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password);

    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model<UserDocument, UserModel>("user", UsersSchema);
