import express from "express";
import path from "path";
import sendNotifications from "../utils/send";
import userModel from "./model/user";

const app = express.Router();

app.post("/subscribe", async (request, response) => {
  console.log(`Subscribing ${request.body.endpoint}`);

  const newSubscription = await userModel.create({ ...request.body });

  const options = {
    vapidDetails: {
      subject: "mailto:myemail@example.com",
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
    },
  };
  try {
    const res2 = await webPush.sendNotification(
      newSubscription,
      JSON.stringify({
        title: "Hello from server",
        description: "this message is coming from the server",
        image:
          "https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg",
      }),
      options
    );
    console.log(res2);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

  response.sendStatus(200);
});

app.post("/remove-subscription", (request, response) => {
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
  response.sendFile(path.join(process.cwd(), "/views/index.html"));
});
