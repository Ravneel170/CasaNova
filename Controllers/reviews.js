const Review = require ('../Models/review');

const Listings = require ('../Models/listing');


//Post Route:

module.exports.createReview = async (req,res) => {
 
  let {id} = req.params;

  let listing = await Listings.findById(id);

   let newReview = new Review(req.body.review);

   newReview.author = req.user.id;

   listing.reviews.push(newReview);

   await newReview.save();

   await listing.save();

   req.flash('success', 'New Review Added!');

   res.redirect(`/listings/${id}`);
     
}


//Delete Route:

module.exports.destroyReview= async (req,res) => {

  let {id,reviewId} = req.params;

  await Listings.findByIdAndUpdate(id, {$pull : {reviews:reviewId} });

  await Review.findByIdAndDelete(reviewId);

  req.flash('success', 'Review Deleted!');

  res.redirect(`/listings/${id}`);
}