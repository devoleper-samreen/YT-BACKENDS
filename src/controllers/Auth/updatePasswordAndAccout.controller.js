import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if ( !isPasswordCorrect ) {
        throw new ApiError(400, "invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    res.status(200).json(
        new ApiResponse(200, {}, "password changed successfully")
    )
})


const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullname, email} = req.body

    if ( !( fullname || email )) {
        throw new ApiError(400, "all fields are requird")
    }

   const user = await User.findByIdAndUpdate(
        req.user?._id,
         {
            $set: {
                fullname: fullname,
                 email: email
            }
         },
         {
            new: true
         }
        ).select("-password")

        return res.status(200).json(
            new ApiResponse(200, user, "account detail updated successfully")
        )
})

export {changeCurrentPassword, updateAccountDetails}