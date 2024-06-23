import { Router } from "express";
import { registerUser} from "../controllers/user.controller.js"
import { loginUser } from "../controllers/login.controller.js";
import { logoutUser } from "../controllers/logout.controller.js";
import { upload } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { refreshAccessToken } from "../controllers/refAccToken.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

export default router