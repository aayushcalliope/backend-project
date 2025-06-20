import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateCoverImage,
  updateUserAvatar,
} from "../controllers/user.controllers.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secure routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJwt, upload.single("/coverImage"), updateCoverImage);

router.route("/c/:username").get(verifyJwt, getUserChannelProfile);

router.route("/watch-history").get(verifyJwt, getWatchHistory);
export default router;
