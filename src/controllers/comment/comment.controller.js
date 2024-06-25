
import {Comment} from "../../models/comment.model.js"
import {ApiError} from "../../utils/apiError.js"
import {ApiResponse} from "../../utils/apiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    //const {page = 1, limit = 10} = req.query

    const {videoId} = req.params

    if ( !videoId ) {
        throw new ApiError(400, "videoId not found")
    }

    const getComments = await Comment.find({videoId})

    if ( !getComments ) {
        throw new ApiError(400, "comment not fetched")
    }

    res.status(200).json(
        new ApiResponse(200, getComments, "fetched comment successfully")
    )
    
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if (!(videoId || content)) {
        throw new ApiError(400, "videoid and content is must")
    }

    const comment = await Comment.create(
        {
            video: videoId,
            content: content
        }
    ) 

    if ( !comment ) {
        throw new ApiError(400, "comment is not create")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "comment seccessfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {videoId} = req.params
    const {comment} = req.body

    if ( !(comment || videoId ) ) {
        throw new ApiError(400, "provided updated comment and valid videoId")
    }

    const existedComment = await Comment.findById(videoId)

    if ( !existedComment ) {
        throw new ApiError(404, "comment not found" )
    }

    if ( comment.owner !== req.user) {
        throw new ApiError(403, "You are not allowed")
    }

    comment.content = comment

    const savedUpdetedComment = await comment.save()

    if ( !savedUpdetedComment ) {
        throw new ApiError(400, "updated comment not save in db")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "comment update successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params

    if ( !commentId ) {
        throw new ApiError(400, "comment id not found");
    }

    const comment = await Comment.findById(commentId)

    if ( !comment ) {
        throw new ApiError(400, "comment not delete");
       }

    if (comment.owner !== req.user) {
        throw new ApiError(403, "You are not allowed");
    }

    try {
        await Comment.findByIdAndDelete(commentId)
    
    } catch (error) {
        throw new ApiError(503, `${error.message}`)
    }

   res.status(200).json(
    new ApiResponse(200, comment, "comment delete seccessfully")
   )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }