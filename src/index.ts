import express from "express";
import { connectDB } from "./db";
import config from "./config";
import router from "./router/poll";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://obho-poll.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

connectDB()
  .then(() =>
    app.listen(config.PORT, () => console.log(`서버가 시작되었습니다. PORT: ${config.PORT}`))
  )
  .catch((e) => console.error(e));
