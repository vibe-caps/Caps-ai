import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/caps";

let conn: typeof mongoose | null = null;

export async function connectMongo() {
  if (conn) return conn;
  if (mongoose.connection.readyState === 1) return mongoose;
  conn = await mongoose.connect(uri);
  return conn;
}
