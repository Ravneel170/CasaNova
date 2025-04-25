const express = require('express');

const router = express.Router({mergeParams:true});

const wrapAsync = require('../utils/wrapAsync');

const ExpressError = require('../utils/ExpressError');

const Listings = require('../Models/listing');

const Review = require('../Models/review');

const {validateReview, isLoggedIn, isReviewAuthor} = require ('../middleware');

const reviewController = require('../Controllers/reviews');


router.post('/', isLoggedIn,validateReview , wrapAsync(reviewController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports = router;