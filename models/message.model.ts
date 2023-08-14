import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// message model type
export interface IMessage extends Document {
  message: { text: string };
  users: IUser[];
  from: IUser;
}

const messageSchema: Schema<IMessage> = new Schema({
  message: {
    text: {
      type: String,
      required: true,
    },
  },
  users: Array,
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Message: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>("messages", messageSchema);

export default Message;
