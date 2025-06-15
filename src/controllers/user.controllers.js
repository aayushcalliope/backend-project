import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend or postman

  const { fullName, email, username, password } = req.body;

  // console.log(req.body);
  console.log("email:", email);
  //check validation :not empty
  // if (fullName === "") {
  //   throw new ApiError(400,"fullName is required")
  // }
  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //check if user already exists -check: email or username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //check either avatar exists or not
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  //upload them to cloudinary,avatar and check avatar id upload or not
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is not uploaded");
  }

  //create user object-create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //check for user creation
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering user");
  }
  // console.log("=== Files received ===");
  // console.log("req.files:", req.files);
  // console.log("Avatar:", req.files?.avatar?.[0]?.path);
  // console.log("CoverImage:", req.files?.coverImage?.[0]?.path);

  //return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
  // res.status(200).json({
  //   message: "learning something",
  // });
});

export { registerUser };
