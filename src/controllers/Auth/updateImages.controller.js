import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"

const updateUserAvatar = asyncHandler(async (req, res) => {

  const avatarLocalPath =  req.file?.path

  if ( !avatarLocalPath) {
    throw new ApiError(400, "avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if ( !avatar.url) {
    throw new ApiError(400, "error uploading avatar on cloudinary")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set: {
            avatar: avatar.url
        }
    },
    {
        new: true
    }
  ).select("-password")

  return res.status(200).json(
    new ApiResponse(200, user, "avatar is updated successfully")
  )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {

    const coverImageLocalPath =  req.file?.path
  
    if ( !coverImageLocalPath) {
      throw new ApiError(400, "coverImage file is missing")
    }
  
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  
    if ( !coverImage.url) {
      throw new ApiError(400, "error uploading coverImage on cloudinary")
    }
  
  const user =  await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set: {
            coverImage: coverImage.url
          }
      },
      {
          new: true
      }
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, user, "covarImage is updated successfully")
      )
  })

  export {updateUserAvatar, updateUserCoverImage}