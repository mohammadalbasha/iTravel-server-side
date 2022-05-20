const multer=require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// locally 
// // where to save images 
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './images');
//     },
//     filename: (req, file, cb) => {
//     cb(null,Date.now() +  file.originalname); 
//     }
//   });

//cloudly
//where to save images
const fileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images',
    //format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => Date.now() +  file.originalname,
  },
});




  // filtering images 
const imageFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  
module.exports.uploadImage =  multer({ storage: fileStorage, fileFilter: imageFilter }) ; 

