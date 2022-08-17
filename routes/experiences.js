const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authenticaion');

const experiencesController = require('../controllers/experiences');

router.get('/getExperiences',
            experiencesController.getExperiences);

router.post('/addExperience',
            authMiddleware.isLoggedIn,
            experiencesController.addExperience
);

module.exports = router;