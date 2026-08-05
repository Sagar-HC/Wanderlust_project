const express = require("express");
const router = express.Router({mergeParams:true});
const { isLoggedIn ,isOwner,validateListing,validatereview,isAuthor } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const reviewController =require("../controllers/reviews.js");

//reviews
// reviews post route
router.post("/",isLoggedIn, validatereview ,wrapAsync(reviewController.createReview));

//delete review route

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;