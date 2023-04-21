import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ChatSchema = new Schema(
  {
    members: { type: Array, required: true },
    messages: { type: Array, required: false },
  },
  { timestamps: true }
);

export default model("Chat", ChatSchema);
