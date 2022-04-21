const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(token){

        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
    
            if(err) res.status(403).json("Token not valid");
            req.user = user;
            // console.log(req.user)
            next();
        });
    }else{
        return res.status(401).json("You are not authenticated!");
    }


}

const verifyTokenAndAuthorization = (req, res, next) => {
   
    verifyToken(req, res, ()=>{
        if (req.user.username === req.params.username || req.user.isAdmin) {
            
            next()
        } else {
            res.status(403).json("You are not allowed to do that" )
            
        }
    })


}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not alowed to do that!");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}