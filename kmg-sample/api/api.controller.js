const express = require('express');
const router = express.Router();
const apiService = require('./api.service');

// routes
router.post('/setData', apiService.setData);
router.post('/signup', apiService.signup);
router.post('/login', apiService.login);
router.post('/logout', apiService.logout);
router.post('/verifyOTP', apiService.verifyOTP);
router.post('/getOTP', apiService.getOTP);
router.post('/changeOldPassword', apiService.update2);
router.post('/changePassword', apiService.update);
router.post('/getSurvey', apiService.getSurvey);
router.post('/getSurvey', apiService.getSurvey);
router.post('/getGroup', apiService.getGroup);
router.post('/getQuestion', apiService.getQuestion);
router.post('/getProfileData', apiService.getProfileData);
router.post('/changeNumber', apiService.changeNumber);
router.post('/changeSOS', apiService.changeSOS);


module.exports = router;