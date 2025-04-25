const express = require('express');

const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');

const passport = require('passport');

const {savedRedirectUrl} = require('../middleware');

const userController = require('../Controllers/users');


router.route('/signup')
.get(userController.singnUpForm)
.post(wrapAsync(userController.signUp));


router.route('/login')
.get(userController.loginForm)
.post(savedRedirectUrl,passport.authenticate('local',{failureRedirect: '/login', failureFlash: true}), userController.login);

router.get('/logout', userController.logout);

module.exports = router;

