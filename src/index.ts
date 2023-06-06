import express from "express";
import { connectDB } from "./db";
import config from "./config";
import router from "./router/poll";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

connectDB()
  .then(() =>
    app.listen(config.PORT, () => console.log(`서버가 시작되었습니다. PORT: ${config.PORT}`))
  )
  .catch((e) => console.error(e));
