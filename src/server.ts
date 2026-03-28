import app from "./app";
import dotenv from "dotenv";
import mongoose from "./config/db";
import dbConnection from "./config/db";

dotenv.config();

dbConnection()


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
