import mongoose from "mongoose";

const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected ✅");

   
  })
  .catch((err) => {
    console.error("DB Connection Error ❌", err);
  });

}

export default dbConnection