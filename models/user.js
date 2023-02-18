import { model, Schema } from "mongoose";

const Subscribe = new Schema({
  endpoint: String,
  expirationTime: Number,
  keys: {
    p256dh: String,
    auth: String,
  },
});

const UserSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    dropDups: true,
  },
  subscribe: Subscribe,
});

export default model("User", UserSchema);
