const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";


main().then(() =>{
    console.log("db connected");
}).catch((err) =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(mongo_url);
} 

const initdb = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"69e9fc66f73ce3db61a596b2"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
 
};

initdb();