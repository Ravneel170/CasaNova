const Listings = require ('../Models/listing');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken});

//index route

module.exports.index = async (req,res)=> {

  const listings = await Listings.find();

  res.render('./house/index', {listings});
}

//New route

module.exports.renderNewForm = (req,res)=> {


 res.render('./house/new');

}


//Show route:


module.exports.showListing = async (req,res)=> {

  let {id} = req.params;

  const listing = await Listings.findById(id).populate({path:'reviews', populate: {path:'author'}}).populate('owner');

  if (!listing) {
 
    req.flash('error', 'Listing does not exist!');
     
    res.redirect('/listings');
  }

  res.render('./house/show', {listing});
}


//Post route:

module.exports.createListing = async(req,res,next) => {

 let response = await geocodingClient.forwardGeocode({

    query: req.body.listing.location,

    limit: 1

  })
    .send()

let url = req.file.path;

let filename = req.file.filename;

const newListing = new Listings(req.body.listing);

newListing.owner = req.user.id;

newListing.image = {url, filename};

newListing.geometry = response.body.features[0].geometry ;

let savedListing = await newListing.save();

console.log(savedListing);

req.flash('success', 'New Listing Created!');

res.redirect('/listings');

   }


//Edit route:

module.exports.renderEditForm = async (req,res)=> {

  let {id} = req.params;

  let listing = await Listings.findById(id);

  if (!listing) {
 
    req.flash('error', 'Listing does not exist!');
     
    res.redirect('/listings');
  }

  let originalImageUrl = listing.image.url;

  originalImageUrl  = originalImageUrl.replace('/upload', '/upload/h_250,w_250');

  res.render('./house/edit', {listing, originalImageUrl});
}



//Update route:

module.exports.updateListing = async(req,res)=> {

let {id} = req.params;

 let listing = await Listings.findByIdAndUpdate(id,{...req.body.listing});

if ( typeof req.file !== "undefined") {

 let url = req.file.path;

 let filename = req.file.filename;
 
listing.image = {url, filename};

await listing.save();

}

 req.flash('success', 'Listing Updated');

 res.redirect(`/listings/${id}`);

 }


 //Delete route:

 module.exports.destroyListing = async (req,res)=> {

  let {id} = req.params;

 await Listings.findByIdAndDelete(id);

 req.flash('success', 'Listing Deleted!');

  res.redirect('/listings');
}