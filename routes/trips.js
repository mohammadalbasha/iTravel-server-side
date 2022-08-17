const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authenticaion');
const tripsController = require('../controllers/trips');
const {uploadImage} = require('../shared/uploadingFiles');


router.post('/addTrip',
            authMiddleware.isLoggedIn,
            uploadImage.array('images', 3),
            tripsController.addTrip);

router.get('/getTrips',
            tripsController.getTrips);

router.get('/getTrip/:tripId',
            tripsController.getTrip)

router.post('/addInterestedUser/:tripId',
            authMiddleware.isLoggedIn,
            tripsController.addInterestedUser)
module.exports = router;