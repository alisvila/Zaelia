import express from "express";
import sendNotifications from "../utils/send.js";
import UserModel from "../models/user.js";

const app = express.Router();

app.post("/subscribe", async (req, res) => {
  const username = req.body.username || "ali";

  console.log(`Subscribing ${req.body.subscribe.endpoint}`);
  let oldOrNew;

  try {
    const newSubscription = new UserModel({
      username: "ali",
      subscribe: { ...req.body?.subscribe },
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
      subscribe: { ...req.body?.subscribe },
    });
  }

  try {
    await sendNotifications(oldOrNew.subscribe, {
      title: "hello",
      description: "hello from server",
    });
    res.status(200).json(oldOrNew);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/remove-sub", async (request, response) => {
  const username = request.body.username || "ali";
  const newSub = await UserModel.findOne({
    username: new RegExp(`${username}`, "i"),
  });
  newSub.subscribe = undefined;
  try {
    await newSub.save();
  } catch (e) {
    response.status(500).json(e);
  }

  console.log(`Unsubscribing ${request.body.endpoint}`);
  response.status(200);
});

app.post("/notify-me", async (req, res) => {
  const username = req.body.username || "ali";
  let foundUser;

  try {
    foundUser = await UserModel.findOne({
      username: new RegExp(`${username}`, "i"),
    });
  } catch (e) {
    // TODO: check for error code 11000 or sth
    res.status(500).json(e);
  }

  if (!foundUser.subscribe) {
    res.status(400).json({ error: "user dosent subscribe" });
  }

  try {
    await sendNotifications(foundUser.subscribe, {
      title: "hello",
      description: "hello from server",
    });
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/notify-all", async (request, response) => {
  const allWithSub = await UserModel.find({ subscribe: { $exists: true } });
  console.log("Notifying all subscribers");

  allWithSub.forEach((subscription) => {
    sendNotifications(subscription.subscribe, {
      title: "brodcast",
      description: "server brodcast",
    });
  });

  response.status(200).json(allWithSub);
});

app.get("/", (request, response) => {
  console.log(process.cwd());
  res.render("index");
  //   response.sendFile(path.join(process.cwd(), "index"));
});

export default app;
