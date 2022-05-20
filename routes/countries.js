const express = require('express');
const router = express.Router();

const countriesController = require('../controllers/countries');

router.get('/getGeneralInformations/:category/:value', 
            countriesController.getGeneralInformations);

module.exports = router;