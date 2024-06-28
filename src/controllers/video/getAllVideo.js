import {Video} from "../../models/video.model.js"
import {ApiError} from "../../utils/apiError.js"
import {ApiResponse} from "../../utils/apiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../../utils/cloudinary.js"
import { deleteOnCloudinary } from "../../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const { userId } = req.query

    if ( !userId) {
        throw new ApiError(400, "please provide userId")
    }

    const AllVideos = await Video.findById({owner: userId})

    if ( !AllVideos) {
        throw new ApiError(500, "videos not found")
    }

    res.status(200).json(
        new ApiResponse(200, AllVideos, "fetched all videos successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if ( title==="" || description==="") {
        throw new ApiError(400, "title and description both are required ")
    }

    const videoLocalPath =  req.files?.videoFile[0]?.path
    console.log(videoLocalPath)

    const thumbnailLocalPath =  req.files?.thumbnail[0]?.path
    console.log(thumbnailLocalPath)

    if ( !videoLocalPath) {
        throw new ApiError(400, "videoLocalPath mein aaya hi nahi file is required")
    }

    if ( !thumbnailLocalPath) {
        throw new ApiError(400, "thumbnailLocalPath mein aaya hi nahi file is required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if ( !video ) {
        throw new ApiError(400, "video cloudinary pe upload nahi hua")
    }
    console.log(video.url)

    if ( !thumbnail ) {
        throw new ApiError(400, "thumbnail cloudinary pe upload nahi hua")
    }

    console.log(thumbnail.url)

    const CreateVideo = await Video.create(
        {
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url
        }
    );

      const savedVideo = await CreateVideo.save()

    if ( !savedVideo) {
        throw new ApiError(500, "some thing went wrong while created video")
    }

    return res.status(201).json(
        new ApiResponse(200, savedVideo,  "video published seccessfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    console.log(videoId)
    const getVideo = await Video.findById(videoId)

    if ( !getVideo) {
        throw new ApiError(404, "video not found")
    }

    res.status(200).json(
         new ApiResponse(200, getVideo, "video found seccessfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const {title, description} = req.body
    const thumbnail =  req.file?.path

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title,
                description: description,
                thumbnail: thumbnail
            }
        },
        {
            new: true
        }
    )
    
    res.status(200).json(
        new ApiResponse(200, video, "video details update seccessfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findByIdAndDelete(videoId)
    console.log(video)

    if ( !video) {
        throw new ApiError(400, "videoId is wrong")
    }

    const extrectPublicId = (videoFile) => {
        const parts = videoFile.split('/');
        const fileName = parts[parts.length - 1];
        const publicId = fileName.split('.')[0];
        return publicId;
      };

      const deleteFromCloudinary = await deleteOnCloudinary(extrectPublicId) 

      if ( !deleteFromCloudinary) {
        throw new ApiError(500, "cloidinary se delete nahi hui")
      }

    res.status(200).json(
        new ApiResponse(200, video, "video delete seccessfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if ( !videoId) {
        throw new ApiError(400, "video id not found")
    }

    const video = await Video.findById(videoId)

    if ( !video) {
        throw new ApiError(404, "video not feched")
    }

    // check you are the owner of this video or not
    if ( !(req.user._id === video.owner._id) ) {
        throw new ApiError(400, "you are not the owner of this video");
    }

    video.isPublished = false

    if (req.user._id === video.owner._id) {
        throw new ApiError(400, "you are not the owner of this video");
    }

    video.isPublished = true

    await video.save({ validateBeforeSave: false })

    res.status(200).json(
        new ApiResponse(200, {}, "flag pass successfully")
    );



})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}


/*
{"_id":{"$oid":"667a8a9147505e44f0c96b51"},"videoFile":"http://res.cloudinary.com/dezv22onr/video/upload/v1719306892/xdohd7tt1xajl2jfi7rd.mp4","thumbnail":"http://res.cloudinary.com/dezv22onr/image/upload/v1719306897/qvrhueqo8mjidgw59hpc.png","title":"DSA","description":"dsa in js","views":{"$numberInt":"0"},"isPublished":true,"createdAt":{"$date":{"$numberLong":"1719306897953"}},"updatedAt":{"$date":{"$numberLong":"1719306897953"}},"__v":{"$numberInt":"0"}} */