import express from "express";
import path from "path";
// import sendNotifications from "../utils/send";
import userModel from "../models/user.js";
import webpush from "web-push";

const app = express.Router();

app.post("/subscribe", async (req, res) => {
  //   console.log(`Subscribing ${req.body.endpoint}`);

  const newSubscription = await userModel.create({ ...req.body });
  console.log(newSubscription);
  const test = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/dtSy3aV3ir8:APA91bFgYBE-us11WN-6zEpWduN7Cy6gMFAzoWE7n28KT-knJpiofkOyB39B6ZSb9kuJ6f17Bfd_wtCvFeYkvSGPpts-o00VskSqPzI_NJQMM5EdveuvBvGGMaStE58XkdRxAKUjB8WI",
    expirationTime: null,
    keys: {
      p256dh:
        "BE-3E5Ip8nf22Vegxh6rIY3mBs2zAKDEe9b2ILnLQNRv-wJXwdY65rbu6sB3zuozLUXnXuDt64PxFcXNfxWgCjw",
      auth: "Xe-vJK3CUXiOFFbXi5NPTg",
    },
  };

  const options = {
    vapidDetails: {
      subject: "mailto:myemail@example.com",
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
    },
  };
  try {
    await webpush.sendNotification(
      test,
      JSON.stringify({
        title: "Hello from server",
        description: "this message is coming from the server",
        image:
          "https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg",
      }),
      options
    );
    // res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

  res.sendStatus(200);
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
  res.render("index");
  //   response.sendFile(path.join(process.cwd(), "index"));
});

export default app;
