const jwt =  require("jsonwebtoken");
const {Secret_Key}  =  require('../Keys/Keys');
const mongoose = require('mongoose');
const User    =  mongoose.model("User");


module.exports =(req, res, next)=>{

    const {authorization}= req.headers;
    if(!authorization)
    {
       return res.status(401).json({error: "You must be logged in"});
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token, Secret_Key, (error, payload)=>{
        if(error)
        {
          return  res.status(401).json({error: "You must be logged in"});
        }

        const {_id} = payload;
        User.findById(_id)
        .then(userData =>{
            req.user = userData;
            next();
        })
      

    } )

}