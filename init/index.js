const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing");
const User = require("../models/user.js");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";


main().then(() =>{
    console.log("db connected");
}).catch((err) =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(mongo_url);
} 

// const initdb = async () =>{
//      await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({...obj,owner:"6a6c8debd0b9195df094eb55"}));
//      await Listing.insertMany(initData.data);
//     console.log("data was initialized");
    
   
// };

// initdb();
const initdb = async () => {
    await Listing.deleteMany({});

    // Get an actual existing user from your User collection
    const user = await User.findOne();
    if (!user) {
        console.log("No user found in the database — create one first (e.g. via signup) before seeding.");
        return;
    }

    initData.data = initData.data.map((obj) => ({ ...obj, owner: user._id }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initdb();