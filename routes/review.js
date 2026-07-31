const express = require("express");
const router = express.Router({mergeParams:true});
const { isLoggedIn ,isOwner,validateListing,validatereview,isAuthor } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//reviews
// reviews post route
router.post("/",isLoggedIn, validatereview ,wrapAsync(async (req,res)=>{
     console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","New review created ");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(async(req,res)=>{

        let { id, reviewId } =req.params//req.params andre id export madkodtutte

        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await Review.findByIdAndDelete(reviewId);

        req.flash("success"," review deleted successfully ");

        res.redirect(`/listings/${ id }`);

}));

module.exports = router;