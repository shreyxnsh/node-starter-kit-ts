import mongoose from "mongoose";

import env from "./env";

const uri = env.MONGODB_URI;
const connectDB = async () => {
  return mongoose
    .connect(uri)
    .then(() => console.log("Database connection established successfully"))
    .catch((error) => console.log("Error connecting to Database ", error));

  // clone db
};

export default connectDB;
