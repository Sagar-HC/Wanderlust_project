const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
};

module.exports.showRoute = async(req,res)=>{
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

};

module.exports.createListing= async(req,res,next)=>{
   
        console.log(req.file);
        let url = req.file.secure_url;
        let filename = req.file.public_id;
        console.log(url," ",filename); 
         const newListing = new Listing(req.body.listing);
         newListing.owner = req.user._id; 
         newListing.image = { url, filename};   
         await newListing.save();
        req.flash("success","New Listing created ");
        res.redirect("/listings");
       
};

module.exports.editListing = async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
    if(!listing){
        res.flash("error","listing not present");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_150");
    res.render("listings/edit.ejs",{ listing,originalImageUrl});
    //here {listing is to pass the  listing variable data to ejs template} 
}

module.exports.updateListing = async (req,res) =>{
    let {id} =req.params;
    let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});

    if(typeof req.file != "undefined"){
         let url = req.file.secure_url;
        let filename = req.file.public_id;
        listing.image = { url, filename };
        await listing.save(); 
    }
     req.flash("success","Listing updated ");
     if(!listing){
        req.flash("error"," listing not found ");
        res.redirect("/listings");
    }
    res.redirect(`/listings/${id}`);
    
};

module.exports.deleteListings = async (req,res) =>{
    let {id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted ");
    res.redirect("/listings");
};