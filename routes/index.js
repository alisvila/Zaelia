import express from "express";
import sendNotifications from "../utils/send.js";
import UserModel from "../models/user.js";

const app = express.Router();

app.post("/subscribe", async (req, res) => {
  const username = req.body.username || "ali";

  console.log(`Subscribing ${req.body.endpoint}`);
  //   const newSubscription = await userModel.create({ ...req.body });
  let oldOrNew;

  try {
    const newSubscription = new UserModel({
      username: "ali",
      subscribe: { ...req.body },
    });
    oldOrNew = await newSubscription.save();
  } catch (e) {
    // TODO: check for error code 11000 or sth
    oldOrNew = await UserModel.findOne({
      username: new RegExp(`${username}`, "i"),
    });
  }

  if (!oldOrNew.subscribe) {
    await UserModel.updateOne({
      subscribe: { ...req.body },
    });
  }

  try {
    await sendNotifications(oldOrNew.subscribe, {
      title: "hello",
      description: "hello from server",
    });
    res.sendStatus(200).json(oldOrNew);
  } catch (error) {
    res.sendStatus(500).json(error);
  }
});

app.post("/remove-sub", async (request, response) => {
  const username = request.body.username || "ali";
  //   const newSub = await UserModel.deleteOne({ username: /ali/i });
  const newSub = await UserModel.findOne({
    username: new RegExp(`${username}`, "i"),
  });
  newSub.subscribe = undefined;
  try {
    await newSub.save();
  } catch (e) {
    response.statusCode(500).json(e);
  }

  console.log(`Unsubscribing ${request.body.endpoint}`);
  response.sendStatus(200);
});

app.post("/notify-me", (request, response) => {
  console.log(`Notifying ${request.body.endpoint}`);
  response.sendStatus(200);
});

app.post("/notify-all", (request, response) => {
  console.log("Notifying all subscribers");
  response.sendStatus(200);
});

app.get("/", (request, response) => {
  console.log(process.cwd());
  res.render("index");
  //   response.sendFile(path.join(process.cwd(), "index"));
});

export default app;
