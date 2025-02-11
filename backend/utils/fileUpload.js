const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
    cloud_name: "ddkp56nba",
    api_key: "438774665957971",
    api_secret: "VlbEVlsGjJXkifwFNkzpIkqFFLc",
});

// Multer configuration for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Uploads a file to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer.
 * @param {string} mimetype - The file's MIME type.
 * @returns {Promise<Object>} - Cloudinary upload response.
 */
async function fileUploadUtil(fileBuffer, mimetype) {
    try {
        const resourceType = mimetype.startsWith("image") ? "image" : "raw";

        // Convert buffer to base64 format
        const base64File = `data:${mimetype};base64,${fileBuffer.toString("base64")}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64File, {
            resource_type: "auto",
            format: mimetype.split("/")[1],
            use_filename: true,
            unique_filename: false,
            flags: "attachment:false", // Prevent forced download
        });
        

        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("File upload failed");
    }
}

module.exports = { upload, fileUploadUtil };
