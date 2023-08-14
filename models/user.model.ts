import mongoose, { Model, Schema } from "mongoose";

// user model type --- for test just need a unique username and password
export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true, min: 3, max: 24 },
  email: { type: String, required: true, unique: true, max: 50 },
  fullName: { type: String, required: true },
  password: { type: String, required: true, min: 6 },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("user", userSchema);

export default User;
