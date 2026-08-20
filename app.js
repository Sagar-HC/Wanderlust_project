if(process.env.NODE_ENV != "production"){require("dotenv").config();}

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override"); 
const ejsmate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
//connect mongo
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const Review = require("./models/review.js");

//link to the db 
// const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const db_url = process.env.ATLASDB_URL;

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
    // console.log("DB URL:", db_url);
    await mongoose.connect(db_url);
} 

app.listen(8080,()=>{
    console.log("app is listnening");
});
app.get("/",(req,res)=>{ 
    res.redirect("/listings");
});

//mongo sessions
const store = MongoStore.create({
    mongoUrl :db_url,
    //secret is used to store secret and crypto is used for encryption
    crypto:{
        secret:process.env.SECRET
    },
    //touchAfter is used to update the session after a certain time interval(in secs)
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("error occured in mongostore",err);
});

//session options,these are the conditions for the session  
const sessionOptions = {
    store,
    secret:process.env.SECRET,
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


