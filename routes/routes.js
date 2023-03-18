const express = require("express");
const router = express.Router();

// const userController = require('../controllers/userController');
// const sampleController = require('../controllers/sampleController');
// const authMiddleware = require('../middlewares/authMiddleware');

// // router.get('/samples' , sampleController.getSample);
// router.post('/login' , userController.login);
// router.post('/register', userController.register);

// router.use(authMiddleware.authenticate);

// router.post('/samples', sampleController.addSample);
// router.put('/samples/:sampleID',  sampleController.updateSample);
// router.delete('/samples/:sampleID', sampleController.deleteSample);
// router.post('/request', sampleController.requestSample);
// // router.get('/requests/:sampleId', sampleControllers.getSampleRequests);

// Import controllers
const userController = require('../controllers/userController');
const hospitalController = require('../controllers/hospitalController');
const receiverController = require('../controllers/receiverController');

//auth middleware
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.get('/availableBloodSamples', receiverController.getAvailableBloodSamples);    //get the list of all blood samples available in all hospitals 
router.get('/requests/:bloodType', receiverController.getRequestsByBloodType); //endpoint to get the list of all receivers who have requested a particular blood group from its blood bank


router.use(authMiddleware.authenticate);


// Routes for hospitals
// router.get('/bloodSamples', hospitalController.getBloodSamples);
router.get('/hospital/bloodSamples', hospitalController.getBloodSamples);       //endpoint to get all the blood info that the hospital uploaded
router.post('/hospital/bloodSamples', hospitalController.addBloodSample);        //endpoint to add the blood sample info
router.put('/hospital/bloodSamples/:id', hospitalController.updateBloodSample);     //endpoint to update the respective blood info
router.delete('/hospital/bloodSamples/:id', hospitalController.deleteBloodSample);     //endpoint to delete the respective blood info


// Routes for receivers
router.post('/receiver/requests', receiverController.makeBloodRequest);       //endpoint to request a blood sample
// router.get('/receiver/requests', receiverController.getRequests);

module.exports = router;


