// Make mongoose connection
import mongoose from "mongoose";

export const mongoConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`MongoDB Connected: ${conn.connection.host} 🟢`);
  } catch (error) {
    console.error(error);
  }
};
