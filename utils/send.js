import webpush from "web-push";
import * as dotenv from "dotenv";

dotenv.config();

const options = {
  vapidDetails: {
    subject: "mailto:myemail@example.com",
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
  },
};

async function sendNotifications(subscriptions, { title, description, image }) {
  await webpush.sendNotification(
    subscriptions,
    JSON.stringify({
      title: title,
      description: description,
      image: image,
    }),
    options
  );
  return;
}

export default sendNotifications;
