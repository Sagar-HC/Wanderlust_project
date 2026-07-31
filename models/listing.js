const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require("./review.js");
const User = require("../models/user.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{type:String,
        default:"https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=800&q=60",
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete",async ( listing )=>{
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
    