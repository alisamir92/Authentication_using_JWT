const express = require("express")
const router = express.Router();
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")

//Update user password

router.patch("/:username", verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,
            process.env.PASS_SEC).toString();
            try {
                
                const updatedUser = await User.findOneAndUpdate(
                    {
                    username: req.params.username
                    },
                    {
                        password: req.body.password
                    },
                    {new:true})
                    
                    res.status(200).json(updatedUser)
            } catch (err) {
                res.status(400).json("user not found")
            }
    }

})

// Get User
router.get("/find/:username", verifyTokenAndAdmin, async (req, res)=>{
    

        const user = await User.findOne({username: req.params.username})
        if (user) {
            
            res.status(200).json({user})
        } else {
            res.status(404).json("User not found")
        }
    
})

//Get All Users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    
    try {
      const users = await User.find().sort({ _id: -1 })
        
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// Admins and Non-Admins Stats

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    try {
        
        const stats = await User.aggregate([
            {$group: {
                _id: "$isAdmin",
                total: { $sum: 1 }
            }}
        ])
    
        res.status(200).json(stats)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router