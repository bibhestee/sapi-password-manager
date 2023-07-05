#!/usr/bin/node

const express = require('express');
const authorization = require('../middlewares/auth');
const UserController = require('../controllers/UserController');
const rateLimiter = require('../middlewares/rate_limiter');
const { requestLogger } = require('../middlewares/handlers');

const router = express.Router();
router.get('/', (req, res) => {
    res.status(200).json("Welcome to SAPI password manager");
});

/* signup handler */
router.post('/signup', requestLogger, UserController.signup);
router.post('/signin', requestLogger, UserController.signin);
/* features: password reset/change */
router.post('/forget-password', requestLogger, UserController.forgetPassword);
router.post('/change-password', requestLogger, authorization, UserController.changePassword);

router.get('/api-key/generate', requestLogger, authorization, UserController.generateApiKey);

router.get('/testlimiter', requestLogger, rateLimiter, UserController.signin);

module.exports = router;
