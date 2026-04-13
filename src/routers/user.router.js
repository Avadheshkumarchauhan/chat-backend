import { Router } from "express";
import { getOtherUsers, getUser, searchUser, updateProfile } from "../controllers/user.controller.js";
import { verifyJwt } from "../middleware/auth.Middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.route("/me").get(verifyJwt,getUser);
router.route("/others").get(verifyJwt,getOtherUsers);
router.route("/edit").post(verifyJwt,upload.single("image"),updateProfile);
router.route("/search").post(verifyJwt,searchUser);

export default router