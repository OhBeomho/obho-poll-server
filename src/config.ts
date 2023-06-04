import "dotenv/config";

export default {
  DB_URI: String(process.env.DB_URI),
  PORT: Number(process.env.PORT)
};
