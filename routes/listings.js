const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn ,isOwner,validateListing } = require("../middleware.js");

const listingController = require("../controllers/listu.js");


//index route   
router.get("/",wrapAsync(listingController.index) );

// new route 
// basically this route was acting as listings/id route because the next show route , so this was written before that so that issue would'nt hrouteren
router.get("/new",isLoggedIn,validateListing,(req,res)=>{
        res.render("listings/new.ejs");
});

//show routecc
router.get("/:id",wrapAsync(listingController.showRoute));

//create  listing route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//edit route 
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
}); 
//update route
router.put("/:id", isLoggedIn,isOwner,validateListing,async (req,res) =>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
     req.flash("success","Listing updated ");
     if(!listing){
        req.flash("error"," listing not found ");
        res.redirect("/listings");
    }
    res.redirect(`/listings/${id}`);
    
});

 

//delete route
router.delete("/:id",isLoggedIn, isOwner,async (req,res) =>{
    let {id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted ");
    res.redirect("/listings");
});

module.exports = router;    