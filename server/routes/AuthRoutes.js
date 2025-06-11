import { Router } from "express";
import { getUserInfo, logOut, login, removeProfileImage, signup, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer"

const authRoutes = Router();
const upload = multer({dest: "uploads/profiles/"})

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);

authRoutes.post("/update-profile", verifyToken, upload.single("profile-image"), updateProfile);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout", logOut)

export default authRoutes;
