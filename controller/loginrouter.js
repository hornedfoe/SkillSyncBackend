const express = require('express')

let router = express.Router();

const { login, register , sendOtp , validateOtp, changePassword, isAvailable } = require('../service/loginservice')

router.post('/register', register);
router.post('/login', login);
router.post('/sendOtp' , sendOtp);
router.post('/validateOtp' , validateOtp);
router.post('/changePassword' , changePassword);
router.post('/isAvailable' , isAvailable);

module.exports = router;