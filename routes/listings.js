const express = require("express");
const router = express.Router();
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn ,isOwner,validateListing } = require("../middleware.js");


//index route   
router.get("/",async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
});

// new route 
// basically this route was acting as listings/id route because the next show route , so this was written before that so that issue would'nt hrouteren
router.get("/new",isLoggedIn,validateListing,(req,res)=>{
        res.render("listings/new.ejs");
});

//show routecc
router.get("/:id",async(req,res)=>{
    // console.log(req);
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner"); 
    if(!listing){
        req.flash("error"," listing not found ");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{ listing });

});

//create route
router.post("/",isLoggedIn,validateListing,async(req,res,next)=>{
        let result = listingSchema.validate(req.body.review);
        console.log(result);
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;    
        await newListing.save();
        req.flash("success","New Listing created ");
        res.redirect("/listings");
       
});

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