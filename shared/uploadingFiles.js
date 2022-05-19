const multer=require('multer');

// where to save images 
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
    cb(null,Date.now() +  file.originalname); 
    }
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

