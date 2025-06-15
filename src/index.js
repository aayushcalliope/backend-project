import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { app } from "./app.js";
import connectDB from "./db/index.js";
// console.log("ENV CHECK:", {
//   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
// });
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection FAILED!!", err);
  });
// require("dotenv").config({path:`./env`});

/*
import express from "express";
const app = express()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERRR:", error);
      throw error;
    });
      
      app.listen(process.env.PORT, () => {
          console.log(`App is listening on port ${process.env.PORT}`)
      })
  } catch (error) {
    console.error("Error", error);
    throw err;
  }
})();*/
