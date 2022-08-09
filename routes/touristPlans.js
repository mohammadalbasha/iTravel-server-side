const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authenticaion');
const touristPlansController = require('../controllers/touristPlans.js')
const {uploadImage} = require('../shared/uploadingFiles');

router.post('/createPlan',
            authMiddleware.isLoggedIn,
            touristPlansController.createPlan
)

router.post('/addPlace/:planId',
            authMiddleware.isLoggedIn,
            uploadImage.array('images', 3),
            touristPlansController.addPlaceToPlan
            )

router.get('/myPlans',
            authMiddleware.isLoggedIn,
            touristPlansController.getMyPlans);

router.get('/myPlansGeneral',
            authMiddleware.isLoggedIn,
            touristPlansController.getMyPlansGeneral);            

router.get('/plans',
            touristPlansController.getPlans);

router.get('/plan/:planId',
            touristPlansController.getPlan);

router.put('/interestedUser/:planId',
            authMiddleware.isLoggedIn,
            touristPlansController.addInterestedUser);

module.exports = router;