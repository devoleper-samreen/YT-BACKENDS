import { Router } from "express";
//from Auth
import { registerUser} from "../controllers/Auth/user.controller.js"
import { loginUser } from "../controllers/Auth/login.controller.js";
import { logoutUser } from "../controllers/Auth/logout.controller.js";
import { refreshAccessToken } from "../controllers/Auth/refAccToken.js";

//from middlewares
import { upload } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

//from update
import {changeCurrentPassword, updateAccountDetails} from "../controllers/update/updatePasswordAndAccout.controller.js"
import {updateUserAvatar, updateUserCoverImage} from "../controllers/update/updateImages.controller.js"

//from pipelines
import {getCurrentUser} from "../controllers/pipe/getUser.controller.js"
import {getUserChannelProfile, getWatchHistory} from"../controllers/pipe/getUserChannelPipelines.js"

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

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

export default router