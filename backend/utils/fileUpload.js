const cloudinary = require('cloudinary').v2
const multer = require('multer');

cloudinary.config({
    cloud_name:"ddkp56nba",
    api_key:"438774665957971",
    api_secret:"VlbEVlsGjJXkifwFNkzpIkqFFLc"


})

const storage = new multer.memoryStorage();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         return cb(null, "./uploads")
//     },
//     filename: function (req, file, cb) {
//         return cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

async function imageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file,{
        resource_type: 'auto'
    })
    return result;
}

const upload = multer({ storage })

module.exports = {upload , imageUploadUtil}