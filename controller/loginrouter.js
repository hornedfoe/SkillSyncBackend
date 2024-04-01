const express = require('express')

let router = express.Router();

const { login, register , sendOtp , validateOtp } = require('../service/loginservice')

router.post('/register', register);
router.post('/login', login);
router.post('/sendOtp' , sendOtp);
router.post('/validateOtp' , validateOtp);

module.exports = router;