import mongoose from "mongoose";
import config from "../config";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.DB_URI);

  console.log("DB에 연결되었습니다.");
}
