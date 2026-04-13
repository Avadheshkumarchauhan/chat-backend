import {Router} from "express"
import { verifyJwt } from "../middleware/auth.Middleware.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/send/:receiverId").post(verifyJwt,upload.single("image"),sendMessage);
router.route("/get/:receiverId").get(verifyJwt,getMessage);



export default router;