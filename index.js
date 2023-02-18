const express = require("express");
import bodyparser from "body-parser";
import mongoose, { mongo } from "mongoose";
const indexRouter = require("./routes/index");
const allowCrossDomain = require("./routes/middleware/cors");

const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(allowCrossDomain);
app.use("/", indexRouter);

app.use((req, res) => {
  res.render("error", { error: { status: 404, message: "page not found" } });
});

app.use(express.static("public"));
app.use(express.static("images"));
app.use(bodyparser.json());

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
  const kittySchema = new mongoose.Schema({
    name: String,
  });

  const kitten = mongoose.model("kitten", kittySchema);
  const sil = new kitten({ name: sil });
}

main().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`app start listening at http://localhost:${port}`);
});
