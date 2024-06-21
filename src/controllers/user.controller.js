import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    //frontend se data lo
    const {fullname, email, username, password} = req.body
    //validation lagao
    if(fullname==="" || email==="" || username==="" || password===""){
        throw new ApiError(400, "All fields are required")
    }
    //check user already exist or not
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    //agar user exist hain to error do
    if ( existedUser) {
        throw new ApiError(409, "user with username and email already exists")
    }

    //avtar and coverImage mila hain to path store karo
   const avatarLocalPath =  req.files?.avatar[0]?.path
   const coverImageLocalPath = req.files?.coverImage[0]?.path

   if ( !avatarLocalPath) {
    throw new ApiError(400, "avatar file is required")
    
   }
    //ab inko cloudinary pe upload 
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    //check karo cloudinary pe upload hua ya nahi
    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }
    //user details ko db mein store karo
   const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    //check karo user create hua ya nahi
    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
    if ( !createdUser) {
        throw new ApiError(500, "someting went wrong while registering the user")
        
    }
    //return response
      return res.status(201).json(
        new ApiResponse(200, createdUser, "user register seccessfully")
    )

})

export {registerUser}