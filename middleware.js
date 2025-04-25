const listings = require ('./Models/listing');

const reviews = require('./Models/review')

const {listingSchema, reviewSchema} = require('./schema');

const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req,res,next) => {

  if(!req.isAuthenticated()){

    req.session.redirectUrl = req.originalUrl;
    
    req.flash('error', 'You must be logged in');
  
     return res.redirect('/login');
  }

  next();
}

module.exports.savedRedirectUrl = (req,res,next) => {

    if (req.session.redirectUrl) {

        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}


module.exports.isOwner = async (req,res,next) => {

  let {id} = req.params;

 let listing = await listings.findById(id);

 if (!listing.owner.equals(res.locals.currUser._id)) {

    req.flash('error', 'UNAUTHORIZED');

   return res.redirect(`/listings/${id}`);
 }

 next();

}


module.exports.validateListing = (req,res,next) => {

  let {error} = listingSchema.validate(req.body);

if (error) {

let errMsg = error.details.map((el) => el.message).join(',');

  throw new ExpressError(400, errMsg);

} else {

   next();
}
   
}


module.exports.validateReview = (req,res,next) => {

  let {error} = reviewSchema.validate(req.body);

  if (error) {

     let errMsg = error.message;

     throw new ExpressError(400, errMsg)
  
    } else {

        next ();
    }
}

module.exports.isReviewAuthor = async (req,res,next) => {

  let {id, reviewId} = req.params;

 let review = await reviews.findById (reviewId);

 if (!review.author.equals(res.locals.currUser._id)) {

    req.flash('error', 'UNAUTHORIZED');

   return res.redirect(`/listings/${id}`);
 }

 next();

}