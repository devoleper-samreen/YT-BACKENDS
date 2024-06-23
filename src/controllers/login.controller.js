import { asyncHandler } from "../utils/asyncHandler.js"
import  { ApiError} from "../utils/apiError.js"
import  { ApiResponse } from "../utils/apiResponse.js"
import { User} from "../models/user.model.js"
import bcrypt from "bcrypt"

const generateAccessAndRefreshToken = async (userId) => 
    {
        try {
            const user = await User.findById(userId)

            const refreshToken = user.generateRefreshToken()

            const accessToken = user.generateAccessToken()
    
            user.refreshToken = refreshToken
            await user.save({validateBeforeSave: false})
    
            return {accessToken, refreshToken}
    
        } catch (error) {
            throw new ApiError(500, "somthing went erong while generating tokens")
        }
    }

const loginUser = asyncHandler(async (req, res) => {
    //frontend se email, password lo
    const {email, username, password} = req.body

    console.log(email);
    console.log(password);


    if ( !username && !email ) {
        throw new ApiError(400, "username or email is required")
    }

    // //db mein check karo username or email, password hain ya nahi(user hain ya nahi)
     const user = await User.findOne({
        $or: [{username}, {email}]
     })

     //agar user nahi hain to error
     if(!user){
        throw new ApiError(404, "user does not exists")
     }
     
    // const hashedPassword = await bcrypt.hash(password, 10)
    // const isPasswordValid = await bcrypt.compare(password, hashedPassword)

    const isPasswordValid = user.isPasswordCorrect(password)

     if ( !isPasswordValid ) {
        throw new ApiError(401, "password is wrong")
     }

    //access or refresh token
     const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

     //optional step
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //send cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
    cookie("accessToken", accessToken, options).
    cookie("refeshToken", refreshToken, options).
    json(
        new ApiResponse(
            200, 
            { 
                user: loggedInUser,
                 accessToken,
                 refreshToken
            }, 
            "user logged in seccessfully"
        )
    )

  
})

export { loginUser, generateAccessAndRefreshToken }