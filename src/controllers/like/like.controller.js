import {Like} from "../../models/like.model.js"
import {ApiError} from "../../utils/apiError.js"
import {ApiResponse} from "../../utils/apiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    console.log(videoId)

    if ( !videoId) {
        throw new ApiError(400, "please provide valid videoId")
    }

   const like =  await Like.create({
        video: videoId,
        likedBy: req.user
    })

    if(!like){
        throw new ApiError(400, "error while generating like")
    }

    res.status(200).json(
        new ApiResponse(200, like, "like seccessfully")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    console.log(commentId)

    if ( !commentId) {
        throw new ApiError(400, "please provide valid commentId")
    }

    const like = await Like.create(
        {
            comment: commentId,
            likedBy: req.user
        }
    )

    if ( !like) {
        throw new ApiError(400, "like not create")
    }

    res.status(200).json(
        new ApiResponse(200, like, "like successfully")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    console.log(tweetId)

    if ( !tweetId) {
        throw new ApiError(400, "please provide valid tweetId")
    }

    const like = await Like.create(
        {
            tweet: tweetId,
            likedBy: req.user
        }
    )

    if ( !like) {
        throw new ApiError(400, "like not create")
    }

    res.status(200).json(
        new ApiResponse(200, like, "like successfully")
    )

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const allLikedVideos = await Like.find(
        {
            video : req.user._id
        }
    )

    if(!allLikedVideos){
        throw new ApiError(504, "Couldn't find likes video")
    }
    
    res.status(200).json(
        new ApiResponse(200, "get all liked videos seccessfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}