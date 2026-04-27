import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder, resource_type = "raw", publicId = "") => {
    return new Promise((resolve, reject) => {
        const options = { 
            folder, 
            resource_type,
            public_id: publicId.split('.')[0]
        };
        
        cloudinary.uploader
        .upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
        })
        .end(fileBuffer);
    })
}