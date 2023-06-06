import express from "express";
import { connectDB } from "./db";
import config from "./config";
import pollRouter from "./router/poll";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", pollRouter);

const corsOptions = {
  origin: "https://obho-poll.netlify.app",
  credentials: true
};

app.use(cors(corsOptions));

connectDB()
  .then(() =>
    app.listen(config.PORT, () => console.log(`서버가 시작되었습니다. PORT: ${config.PORT}`))
  )
  .catch((e) => console.error(e));
