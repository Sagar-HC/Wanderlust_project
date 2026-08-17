if(process.env.NODE_ENV != "production"){require("dotenv").config();}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override"); 
const ejsmate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const Review = require("./models/review.js");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

//this is the seed data filepath
const { data }=require("./init/data.js");

const listingRoute = require("./routes/listings.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


//lets seed the db
// async function seedDB(){
//     await Listing.deleteMany({});
//     await Listing.insertMany(data);
//     console.log("datainserted");
// }
// seedDB();
let required
main().then(() =>{
    console.log("db connected");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_url);
} 
app.listen(8080,()=>{
    console.log("app is listnening");
});
app.get("/",(req,res)=>{
    res.send("hi i am root");
});

//session options,these are the conditions for the session  
const sessionOptions = {
    secret:"mysecurecode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};

app.use(session(sessionOptions));
//flash should always be used before routes.
app.use(flash()); 

//authentication shit
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//noraml code
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


//fake user route
app.get("/fakeuser", async(req,res)=>{
    let demoUser = new User({
        email:"sagar@gamil.com",
        username:"sagar",
    });

    let registeredUser = await User.register(demoUser,"helloworld");
    res.send(registeredUser);
})
//parent routes
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);

app.use((req, res,next) => { 
    res.status(404).send("pagenotfound");
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).send(message);
});


