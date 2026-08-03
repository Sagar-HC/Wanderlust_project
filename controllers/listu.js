const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
};

module.exports.showRoute = (async(req,res)=>{
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

module.exports.createListing= (async(req,res,next)=>{
        let result = listingSchema.validate(req.body.review);
        console.log(result);

         if (!req.body.listing.image || req.body.listing.image.trim() === "") {
        delete req.body.listing.image;
    };
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;    
        await newListing.save();
        req.flash("success","New Listing created ");
        res.redirect("/listings");
       
})