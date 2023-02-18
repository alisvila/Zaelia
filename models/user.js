import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  subscribe: {
    type: Schema.ObjectId,
    ref: "Subscribe",
  },
});

const Subscribe = new Schema({
  endpoint: String,
  expirationTime: Nymber,
  keys: {
    p256dh: String,
    auth: String,
  },
});

export default model("User", UserSchema);
