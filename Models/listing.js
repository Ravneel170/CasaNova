const mongoose = require('mongoose');

const Review = require('./review');

const Schema = mongoose.Schema;

const listingSchema = new Schema ({

 title : {

   type:String
 },

 description: {

   type:String

 },

  price: {

     type:Number
  },

   location: {
      type:String
   },

   country: {
     type:String
   },

    image: {

       url: String,

       filename: String
    },

    reviews: [

      {

        type: Schema.Types.ObjectId, 
        ref:'Review'
      }
    ],

    owner: {
  
         type: Schema.Types.ObjectId,
         ref:'User'
    },

    geometry: {
 
         type: {

           type : String,

           enum : ['Point'],

           required : true
         },

         coordinates : {

            type : [Number],

            required: true
         }

    }
});

listingSchema.post('findOneAndDelete', async(listing)=> {

   if (listing.reviews.length) {

      await Review.deleteMany({_id:{$in:listing.reviews}});
   }
});

const Listings = mongoose.model('Listings', listingSchema);
 
module.exports = Listings;