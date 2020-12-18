const express  = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Using Schema from mongoose.model (collections)
const User = mongoose.model("User");

// hashing using bcrypt.hash
const bcrypt = require('bcryptjs');

// providing token to the user by json webtoken so that he can use protected resources
const jwt = require('jsonwebtoken');

// Using Secret key for creating webtoken
const {Secret_Key} = require('../keys/Keys');

// // fetching middleware
// const requireLogin = require("../middlewares/requireLogin")
// router.get('/protected',requireLogin,  (req, res)=>{
//     res.send("hello protected");
// })

router.post("/signup", (req, res)=>{
const {name, password} = req.body;
                    if(!name||!password)
                    {
                        return res.status(422).json({error:"Please Add All The Details"});
                    }
                    User.findOne({name:name})
                    .then(savedUser =>
                        {
                            if(savedUser){
                                return res.status(422).json({error:"User Already Exists"})
                            }

                            bcrypt.hash(password, 12)
                            .then(hashedPassword=>{
                                const user = new User(
                                    {
                                        name,
                                        password: hashedPassword
                                    }
                                );
                                user.save()
                                .then(user => {
                                    res.send({message: "User Created Successfully "})
                                })
                                .catch(error => 
                                    {
                                        console.log(error);
                                    }
                                    );

                            });
                           


                        }
                    )
                    .catch(error =>{
                        console.log(error);
                    })

                    

});

router.post("/signin", (req, res)=>{
                const {name, password} = req.body;
                if(!name || !password){
                    return res.status(422).json({error:"Enter The Credentials"});         
                }
                User.findOne({name:name})
                .then(existingUser=>{
                    if(!existingUser)
                    {
                      return  res.status(404).json({error:"Invalid User or password"})
                    }
                    bcrypt.compare(password, existingUser.password)
                    .then(domatch=> {
                        if(!domatch)
                        {
                         return   res.status(422).send({error:"Invalid User or password"});
                        }
                        // res.send({message:"User Signedin Sucessfully"});
                        const token =  jwt.sign({_id: existingUser._id}, Secret_Key);
                        const {_id, name} = existingUser;
                        res.json({token, user:{_id,name }});

                    })
                    .catch(err =>{
                        console.log(err);
                    })
                })
                .catch(err=>{
                    console.log(err);
                })
})

module.exports=  router;