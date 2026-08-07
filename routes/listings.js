const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn ,isOwner,validateListing } = require("../middleware.js");

const listingController = require("../controllers/listu.js");


//index route   
router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));

// new route 
// basically this route was acting as listings/id route because the next show route , so this was written before that so that issue would'nt hrouteren
router.get("/new",isLoggedIn,validateListing,(req,res)=>{
        res.render("listings/new.ejs");
});

//show route

router.route("/:id").get(wrapAsync(listingController.showRoute))
.put( isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync (listingController.deleteListings));


//edit route 
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.editListing)); 
//update route

module.exports = router;    