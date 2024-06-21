import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs"

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null
        }

        //upload file on cloudinay
        cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file uploaded seccessfully
        console.log("file upload on cloudinary")
        response.url();
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath)

        return null
    }
}


export {uploadOnCloudinary}