// scripts/migrate.js

const mongoose = require('mongoose');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const Listing = require('../Models/listing'); // Adjust the path based on your project structure

// 1. Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/CasaNova');
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

// 2. Configure Cloudinary
cloudinary.config({
  cloud_name: 'djvvdj8k2', // your Cloudinary cloud name
  api_key: '973647851263364',
  api_secret: 'p_RYjMzENnLUyJqlABlAu0zAR10'
});

// 3. Download image from Unsplash and upload to Cloudinary
async function migrateImage(listing) {
  const unsplashUrl = listing.image?.url;

  // Check if it's an Unsplash image
  if (!unsplashUrl || !unsplashUrl.includes('images.unsplash.com')) return;

  try {
    // Download the image
    const response = await axios.get(unsplashUrl, { responseType: 'arraybuffer' });

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload_stream({
      folder: 'casanova_dev',
      public_id: `listing_${listing._id}`,
      resource_type: 'image'
    }, async (error, result) => {
      if (error) {
        console.error('❌ Upload failed for', listing._id, error);
      } else {
        // Update DB with new Cloudinary URL
        listing.image = {
          url: result.secure_url,
          filename: result.public_id
        };
        await listing.save();
        console.log(`✅ Migrated image for listing ${listing._id}`);
      }
    });

    // Pipe image data into upload
    const stream = require('stream');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(response.data);
    bufferStream.pipe(uploadRes);

  } catch (err) {
    console.error(`❌ Failed to migrate listing ${listing._id}`, err.message);
  }
}

// 4. Main execution function
async function migrateAll() {
  await connectDB();

  const listings = await Listing.find({});

  for (const listing of listings) {
    await migrateImage(listing);
  }

  console.log('🎉 Migration complete');
  mongoose.disconnect();
}

migrateAll();
