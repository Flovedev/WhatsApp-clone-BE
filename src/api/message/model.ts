import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    sender: { type: String, required: true },
    text: { type: String, require: false },
    media: { type: String, requier: false },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
