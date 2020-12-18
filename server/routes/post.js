const express  = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const requireLogin = require("../middlewares/requireLogin");


router.get("/allposts", (req, res)=>{
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(error=>{
        console.log(error)
    })
    

})
router.post('/comment', requireLogin,(req, res)=>{
    const comment = {
        text:req.body.text,
        postedBy: req.user
    }
    req.user.password = undefined;
    console.log(req.user);
    if(!req.user)
    {
       return res.status(401).json("You must be Logged in");
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}

    },
    {new:true}
    ).populate("comments.postedBy", "_id name")
    .exec((err, result)=>{
        if(err)
        {
            return res.status(422).json({error:err})

        }
        else{
            return res.json(result);
        }
    })
   
    

})
router.post("/createpost",requireLogin, (req, res)=>{
    const {title, body} = req.body;
    if(!title||!body)
    {
        return res.status(422).json({error:"Please Add All The Feilds"});
    }

   
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        postedBy : req.user

    })
    post.save()
    .then(result =>{
        res.send({post:result})
    })
    .catch(error=>{
        console.log(error);

    })
})


module.exports = router;