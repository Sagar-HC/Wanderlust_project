const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

const userController = require("../controllers/users.js");

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(userController.userSignup));

//login route
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect :"/login",
    failureFlash:true,
  }),
  userController.login
);
//experinent

//logout route
router.get("/logout",userController.logout);

    

module.exports = router;