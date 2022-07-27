const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const authMiddleware = require('../middlewares/authenticaion');
const {validateUser} = require('./validation');
const {uploadImage} = require('../shared/uploadingFiles');

router.post('/signup',
            uploadImage.single('image'),
         //   validateUser,
            authController.signUp);

router.post('/admin/signUp',
            authMiddleware.isLoggedIn,
            authMiddleware.isAdmin,
            authController.signUp);

router.get('/confirmAccount/:userId', authController.confirmAccount);

router.post('/login', authController.login);

router.get('/getProfile',
          authMiddleware.isLoggedIn,
          authController.getProfile);
            
module.exports = router;


