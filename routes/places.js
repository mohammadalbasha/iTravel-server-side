const express = require('express');
const router = express.Router();

const placesController = require('../controllers/places');

router.get('/' , placesController.getInformationsAboutPlaces);

module.exports = router;