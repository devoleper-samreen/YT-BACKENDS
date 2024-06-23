import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import  {User} from "../models/user.model.js"
import generateAccessAndRefreshToken from "../controllers/login.controller.js"
import { ApiResponse } from "../utils/apiResponse.js"

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if ( !incomingRefreshToken) {
        throw new apiError(401, "unAuthiorized request")
    }

  try {
    const decodedToken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id)
  
    if ( !user ) {
      throw new apiError(401, "invalid refresh token")
    }
  
    if ( incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "refreshed token is expired or used")
    }
  
  const options = {
      httpOnly: true,
      secure: true
  }
   const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
  
  return res.status(200).
  cookie("accessToken", accessToken, options).
  cookie("refreshToken", newRefreshToken, options).
  json(
      new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "access token refreshed")
  )
  
  } catch (error) {
    throw new apiError(401, error?.message || "invalid refresh token")
  }

})

export {refreshAccessToken}