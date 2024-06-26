import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../../models/playlist.model.js"
import {ApiError} from "../../utils/apiError.js"
import {ApiResponse} from "../../utils/apiResponse.js"
import {asyncHandler} from "../../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if ( !(name || description)) {
        throw new ApiError(400, "playlist name and description is must")
    }

    const playlist = await Playlist.create(
        {
            name: name,
            description: description,
            owner: req.user
        }
    )

    if ( !playlist ) {
        throw new ApiError(400, "playlsit not create")
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "playlist create seuccessfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if ( !userId ) {
        throw new ApiError(400, "userId nahi mil rahi")
    }

   const findPlaylist =  await Playlist.find({owner: userId})

   if ( !findPlaylist ) {
    throw new ApiError(400, "playlist not find")
   }

   res.status(200).json(
    new ApiResponse(200, findPlaylist, "playlist fetched successfully")
   )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if ( !playlistId ) {
        throw new ApiError(400, "userId nahi mil rahi")
    }

   const findPlaylist =  await Playlist.findById(playlistId)

   if ( !findPlaylist ) {
    throw new ApiError(400, "playlist not find")
   }

   res.status(200).json(
    new ApiResponse(200, findPlaylist, "playlist fetched successfully")
   )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if ( !(playlistId || videoId)) {
        throw new ApiError(404, "playlistId and VideoId not found")
    }

    const playlist = await Playlist.findById(playlistId)

    if ( !playlist ) {
        throw new ApiError(400, "playlist not found")
    }

    if (playlist.owner !== req.user) {
        throw new ApiError(400, "you are not allowed to")
    }

   const videoAdded = await playlist.videos.push(videoId)

   try {
    await videoAdded.save({ validateBeforeSave: false });
} catch (error) {
    console.log(error);
    throw new ApiError(500, "something went wrong while saving video")
}

res.status(200).json(
    new ApiResponse(200, videoAdded, "video added successfully")
)

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if ( !(playlistId || videoId)) {
        throw new ApiError(404, "playlistId and VideoId not found")
    }

    if (playlist.owner !== req.user) {
        throw new ApiError(400, "you are not allowed to")
    }

    const playlist = await Playlist.findById(playlistId)

    if ( !playlist ) {
        throw new ApiError(400, "playlist not found")
    }

    playlist.videos = playlist.videos.filter(
        (video) => {
            video !== videoId
        }
    );


   try {
    await playlist.save({ validateBeforeSave: false });
} catch (error) {
    console.log(error);
    throw new ApiError(500, "something went wrong while delete video")
}

res.status(200).json(
    new ApiResponse(200, videoAdded, "video delete successfully")
)

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}