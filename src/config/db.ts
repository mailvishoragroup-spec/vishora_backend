import mongoose from "mongoose";

let isConnected = false;

const dbConnection = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);

    isConnected = db.connections[0].readyState === 1;

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Connection Error ❌", error);
    throw error;
  }
};

export default dbConnection;