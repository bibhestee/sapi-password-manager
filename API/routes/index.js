#!/usr/bin/node

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/', (req, res) => {
    res.status(200).json("Welcome to SAPI password manager");
});

/* signup handler */
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
/* features */
router.post('/forget-password', UserController.forgetPassword);

module.exports = router;
