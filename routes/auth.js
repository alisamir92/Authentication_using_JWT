const express = require("express")
const router = express.Router();
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");


//Register
router.post("/register", async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    })

    try {
        const checkUser = await User.findOne({
            username: req.body.username
        })
        if (checkUser) {
            res.status(400).json("User is found")
        }else{

            const savedUser = await user.save();
    
            res.status(201).json(`${user.username} added`);
        }
    } catch (err) {
        res.status(500).json({data: "Use another username or email"});
    }
});




//Login
router.post("/login", async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    });

    if(!user){
        res.status(401).json("Wrong User");
    }else{


        const validePass = user.validatePassword(req.body.password)
        if(!validePass){
            res.status(401).json("wrong password")
        }else{

            const loginToken = jwt.sign({
                username: user.username,
                isAdmin: user.isAdmin
            }, process.env.JWT_SEC,{expiresIn:"3d"});

            res.cookie("access_token", loginToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              }
            )

            res.status(200).json(`Welcome ${user.username}`)
        }
    }

})

//Logout

router.get("/logout", (req, res) => {
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Successfully logged out" });
  });

module.exports = router;