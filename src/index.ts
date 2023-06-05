import express from "express";
import { connectDB } from "./db";
import config from "./config";
import pollRouter from "./router/poll";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/poll", pollRouter);

connectDB()
  .then(() =>
    app.listen(config.PORT, () => console.log(`서버가 시작되었습니다. PORT: ${config.PORT}`))
  )
  .catch((e) => console.error(e));
