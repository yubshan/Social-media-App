const Post = require('../models/Post.js');
const Comment = require("../models/Comment.js");
const Reply = require ('../models/Reply.js');
const asyncHandler = require ('../utils/asyncHandler.js');
const isAdmin = asyncHandler(async ( req, res, next) =>{
    const userId = req.user.id;
    const {commentId, postId , replyId } = req.params;
    let resources ;
    
    if(req.baseUrl.includes('/posts')){
        resources = await Post.findById(postId);
    }else if(req.baseUrl.includes('/comments')){
        resources = await Comment.findById(commentId);
    }else if(req.baseUrl.includes('/replies')){
        resources = await Reply.findById(replyId);
    }

    if(!resources){
        return res.status(404).json({success: false , message: `${resources} not found.`});
    };

    if(resources.author.toString() !== userId){
        return res.status(403).json({success: false, message: "Forbidden. Not an author."})
    };
    next();
})