#!/usr/bin/node

const express = require('express');
const authorization = require('../middlewares/auth');
const UserController = require('../controllers/UserController');
const rateLimiter = require('../middlewares/rate_limiter');


const router = express.Router();
router.get('/', (req, res) => {
    res.status(200).json("Welcome to SAPI password manager");
});

/* signup handler */
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
/* features: password reset/change */
router.post('/forget-password', UserController.forgetPassword);
router.post('/change-password', UserController.changePassword);

router.get('/api-key/generate', authorization, UserController.generateApiKey);

router.get('/testlimiter', rateLimiter, UserController.signin);

module.exports = router;
