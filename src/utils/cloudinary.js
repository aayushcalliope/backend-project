import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); //  Ensure this is at the top!

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Optional: Debug log to confirm .env is loaded
// console.log("Cloudinary ENV:", {
//   name: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
// });

// if (
//   !process.env.CLOUDINARY_CLOUD_NAME ||
//   !process.env.CLOUDINARY_API_KEY ||
//   !process.env.CLOUDINARY_API_SECRET
// ) {
//   throw new Error("Missing Cloudinary config in environment variables");
// }

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    // console.log("File uploaded to Cloudinary:", response.url);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // cleanup
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

export { uploadOnCloudinary };
