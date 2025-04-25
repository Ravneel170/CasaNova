const mongoose = require('mongoose');

const listings = require('../Models/listing');

const initData = require('./data');

async function main() {
  
   await mongoose.connect('mongodb://127.0.0.1:27017/CasaNova')
};


main().then(()=> console.log('Connection Established')).catch(err=>console.log(err.message));


const initDB = async () => {

  await listings.deleteMany({});

  initData.data =  initData.data.map((obj) => ({...obj, owner: '67e71f8becd9d8ea36891665'}));
  
  await listings.insertMany(initData.data);

  console.log('Data is Saved');
}

initDB();
