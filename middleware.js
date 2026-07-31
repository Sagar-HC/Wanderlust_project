const Listing = require("./models/listing");
const { listingSchema,reviewSchema} =require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
  


module.exports.isLoggedIn = (req ,res ,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl =req.originalUrl;
        req.flash("error","please login .");
        return res.redirect("/login");
    }
    next();   
};
//this saves any redirect url into the locals
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","u r not eligible to edit");
        return res.redirect(`/listings/${id}`);
    }next();
};

//validate
 module.exports.validateListing=(req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
//validate review
module.exports.validatereview=(req,res,next)=>{
   
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg);
    }else{
        next();
    } 
}; 

module.exports.isAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","u r not author eligible to edit");
        return res.redirect(`/listings/${id}`);
    }next();
}