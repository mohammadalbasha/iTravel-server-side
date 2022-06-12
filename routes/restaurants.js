const express = require('express');
const router = express.Router();

const restaurantsController = require('../controllers/restaurants');

router.post('/getRestaurants', 
            restaurantsController.getRestaurants);

module.exports = router;