import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const activeCheck=async (req,res) => {
    return res.status(200).json({message:"Running"})
}

export const createPost=async(req,res)=>{
   
    try{

        const userId=req.user.id;
        const {body}=req.body;

        if (!body || body.trim() === "") {
           return res.status(400).json({ message: "Post body is required" });
        }

        let mediaUrl="";
        let fileType="";

        if(req.file){
            mediaUrl=await uploadToCloudinary(
                 req.file.buffer,
                "linkedin_clone/post_media"
            );

            fileType=req.file.mimetype.split("/")[0];
        }

        const post=await Post.create({
            userId,
            body: body.trim(),
            media: mediaUrl,
            fileType
        })
         
        return res.status(201).json({message:"Post Created Successfully",post})
    }
    catch(err){
          console.log("CreatePost Error:", err.message); // yeh add karo
          return res.status(500).json({message: err.message}) 
    }
}

export const getAllPosts=async(req,res)=>{
    try{
      const posts=await Post.find({active:true}).populate("userId","name username email profilePicture");
      return res.status(200).json({posts})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const getUserPosts=async(req,res)=>{
    try{

        let {userId}=req.params;

        if(!userId){
            return res.status(400).json({ message: "UserId is required" })
        }

        const posts = await Post.find({userId,active:true})
        .populate("userId", "name username email profilePicture")
        .sort({ createdAt: -1 }); 

         return res.status(200).json({ posts });

    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const deletePost=async(req,res)=>{

    try{

        const userId=req.user.id;
        const {postId}=req.body;

        if (!postId) {
          return res.status(400).json({ message: "PostId is required" });
        }

        const post=await Post.findById(postId);
        
        if (!post || !post.active) {
           return res.status(404).json({ message: "Post not found" });
        }

        if(post.userId.toString() !== userId.toString()){
            return res.status(403).json({message:"Unauthorized Action"})
        }

         post.active = false;
         await post.save();
        
        return res.status(200).json({message:"Post Deleted Successfully",postId})
          
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const commentPost = async (req,res)=>{

    try{
        
        const userId=req.user.id;
        const {postId,comment}=req.body;

        if (!postId || !comment || comment.trim() === "") {
          return res.status(400).json({ message: "PostId and valid comment are required" });
        }
       
        const post=await Post.findById(postId);

        if (!post || !post.active) {
          return res.status(404).json({ message: "Post not found" });
        }

        const newComment= await Comment.create({
            userId,
            postId,
            body:comment.trim(),
        });

        return res.status(201).json({message:"Comment Added Successfully",newComment});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
} 


export const get_all_comments=async (req,res)=>{

    const {postId}=req.query;

    try{
      
        const post=await Post.findOne({_id:postId});

        if(!post){
            return res.status(404).json({message:"Post Not Found"});
        }

        const comments=await Comment.find({postId:post._id})
        .populate("userId","name username profilePicture");

        return res.status(200).json(comments.reverse());
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const delete_comment_of_user=async (req,res)=>{

    try{
        
        const userId=req.user.id;
        const {commentId}=req.body;

        if (!commentId) {
         return res.status(400).json({ message: "CommentId is required" });
        }

        const comment=await Comment.findById(commentId);

        if(!comment){
            return res.status(404).json({message:"Comment Not Found"});
        }

        if(comment.userId.toString()!== userId.toString()){
            return res.status(403).json({message:"Unauthorized Action"});
        }

        await Comment.deleteOne({ _id: commentId });

        return res.status(200).json({message:"Comment Deleted Successfully"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

export const increment_likes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (!post || !post.active) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes.pull(userId);
      await post.save();
      return res.json({ message: "Post unliked" });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      return res.json({ message: "Post liked" });
    }

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
