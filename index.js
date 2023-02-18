import express from "express";
import bodyparser from "body-parser";
import mongoose, { mongo } from "mongoose";
import indexRouter from "./routes/index.js";
import path from "path";
import * as dotenv from "dotenv";
// const indexRouter = require("./routes/index");
// const allowCrossDomain = require("./routes/middleware/cors");

const app = express();
const port = 3030;
dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(allowCrossDomain);
app.use("/", indexRouter);

app.use((req, res) => {
  res.render("error", { error: { status: 404, message: "page not found" } });
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("images"));
app.use(bodyparser.json());

async function main() {
  mongoose.set("strictQuery", false);

  await mongoose.connect("mongodb://root:example@localhost:27017/");
  console.log("conected?");
  const kittySchema = new mongoose.Schema({
    name: String,
  });

  const kitten = mongoose.model("kitten", kittySchema);
  const sil = new kitten({ name: "sil" });
  sil.save();
}

main().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`app start listening at http://localhost:${port}`);
});
