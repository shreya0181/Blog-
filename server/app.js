const express=require('express');
const mongoose = require('mongoose');
const {URI} = require("./keys/keys");
const PORT  = 5000;
const app=express();


mongoose.connect(URI,{useUnifiedTopology: true, useNewUrlParser: true },  ()=>{
    console.log("mondb connected");
})

// registering Schema to app
require("./models/user");
require("./models/post");



// json parsing the req data
app.use(express.json());
// registering route to app
app.use(require("./routes/auth"));
app.use(require("./routes/post"));



app.listen(PORT, ()=>{
    console.log("server up and running");
})