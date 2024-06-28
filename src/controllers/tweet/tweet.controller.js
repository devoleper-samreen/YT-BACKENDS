import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../../models/tweet.model.js"
import {User} from "../../models/user.model.js"
import {ApiError} from "../../utils/apiError.js"
import {ApiResponse} from "../../utils/apiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    
    if ( content ) {
        throw new ApiError(400, "please provide content")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user
    })

    if ( !tweet) {
        throw new ApiError(400, "tweet not create")
    }

    res.status(200).json(
        new ApiResponse(200, tweet, "tweet create successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.param

    if ( !userId ) {
        throw new ApiError(400, "please provide userId")
    }

    const tweet = await Tweet.findById({owner: userId})

    if ( !tweet ) {
        new ApiError(400, "not find tweets in db")
    }

    res.status(200).json(
        new ApiResponse(200, tweet, "fetched tweet successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.param
    const {content} = req.body

    if ( !content) {
        throw new ApiError(400, "please provide content")
    }

    const tweet = await Tweet.findById(tweetId)

    if ( tweet.owner !== req.user) {
        throw new ApiError(400, "you are not allowed")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        {
            content: content
        }
    )

    if ( !updatedTweet) {
        throw new ApiError(400, "tweet not update")
    }

    res.status(200).json(
        new ApiResponse(200, updatedTweet, "update tweet successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.param

    if ( !tweetId) {
        throw new ApiError(400, "please provide tweetId")
    }

    const tweet = await Tweet.findById(tweetId)

    if ( tweet.owner !== req.user) {
        throw new ApiError(400, "you are not allowed")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if ( !deletedTweet) {
        throw new ApiError(400, "tweet not delete")
    }

    res.status(200).json(
        new ApiResponse(200, deletedTweet, "update tweet successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}