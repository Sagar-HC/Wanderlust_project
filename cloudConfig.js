const cloudinary = require('cloudinary');
const  CloudinaryStorage  = require('multer-storage-cloudinary');

cloudinary.v2.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret :process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
    folder: 'wanderolust_dev',
    allowed_formats: ["png" , "jpg" ,"jpeg"] ,// supports promises as well
  
  filename: function (req, file, cb) {
    cb(undefined, file.originalname);
  } 
});


// console.log('cloudinary.v2:', cloudinary.v2);
// console.log('cloudinary.uploader:', cloudinary.uploader);

module.exports = {
    cloudinary,
    storage
}