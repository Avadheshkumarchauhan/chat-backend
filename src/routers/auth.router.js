import {Router} from "express";
import { login, logOut, signUp} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middleware/auth.Middleware.js";

const router = Router();
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(verifyJwt,logOut);


export default router
