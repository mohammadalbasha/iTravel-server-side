const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authenticaion');
const staysController = require('../controllers/stays');
const {uploadImage} = require('../shared/uploadingFiles');


router.post('/addStay',
            authMiddleware.isLoggedIn,
            uploadImage.array('images', 3),
            staysController.addStay);

router.get('/getStays',
            authMiddleware.isLoggedIn,
            staysController.getStays);

router.get('/getStay/:stayId',
            authMiddleware.isLoggedIn,
            staysController.getStay)

router.post('/addInterestedUser/:stayId',
            authMiddleware.isLoggedIn,
            staysController.addInterestedUser)
module.exports = router;