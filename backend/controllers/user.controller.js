import dotenv from "dotenv";
dotenv.config();
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import Profile from '../models/profile.model.js';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import ConnectionRequest from '../models/connections.model.js';
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import axios from "axios";


export const convertUserDataToPDF = async (userData) => {
  if (!userData || !userData.userId) {
    throw new Error("Invalid user profile data");
  }

  const doc = new PDFDocument({ margin: 50 });
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const fullPath = `uploads/${outputPath}`;
  const stream = fs.createWriteStream(fullPath);

  doc.pipe(stream);

  // 🟢 WAIT for stream to finish (important)
  const streamFinished = new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  // ✅ PROFILE IMAGE FROM CLOUD URL
  if (userData.userId.profilePicture) {
    try {
      const response = await axios.get(userData.userId.profilePicture, {
        responseType: "arraybuffer",
      });

      const imageBuffer = Buffer.from(response.data, "binary");

      doc.image(imageBuffer, {
        align: "center",
        width: 100,
      });

      doc.moveDown();
    } catch (err) {
      console.log("Image load failed in PDF:", err.message);
    }
  }

  // ✅ Basic Info
  doc.fontSize(14).text(`Name: ${userData.userId.name || "N/A"}`);
  doc.text(`Username: ${userData.userId.username || "N/A"}`);
  doc.text(`Email: ${userData.userId.email || "N/A"}`);
  doc.text(`Bio: ${userData.bio || "N/A"}`);
  doc.text(`Current Position: ${userData.currentPost || "N/A"}`);

  doc.moveDown();

  // ✅ Past Work
  doc.fontSize(16).text("Past Work", { underline: true });
  doc.moveDown(0.5);

  if (Array.isArray(userData.pastWork) && userData.pastWork.length) {
    userData.pastWork.forEach((work) => {
      doc.fontSize(14).text(`Company: ${work.company || "N/A"}`);
      doc.text(`Position: ${work.position || "N/A"}`);
      doc.text(`Years: ${work.years || "N/A"}`);
      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(14).text("N/A");
  }

  doc.moveDown();

  // ✅ Education
  doc.fontSize(16).text("Education", { underline: true });
  doc.moveDown(0.5);

  if (Array.isArray(userData.education) && userData.education.length) {
    userData.education.forEach((edu) => {
      doc.fontSize(14).text(`School: ${edu.school || "N/A"}`);
      doc.text(`Degree: ${edu.degree || "N/A"}`);
      doc.text(`Field of Study: ${edu.fieldOfStudy || "N/A"}`);
      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(14).text("N/A");
  }

  doc.end();

  // ⏳ Wait until PDF fully written
  await streamFinished;

  return outputPath;
};



export const register=async (req,res) => {
     
    try{
      const {name,username,email,password}=req.body;

      if(!name || !username || !email || !password){
        return res.status(400).json({message:"All fields are required"});
      }

      const user=await User.findOne({email});

      if(user){
        return res.status(400).json({message:"User already exists"});
      }
      
      const hashedPassword=await bcrypt.hash(password,10);
      
        const newUser=new User({
          name,
          username,
          email,
          password:hashedPassword
        });
        await newUser.save();

        const profile=new Profile({
            userId:newUser._id,
        });
        await profile.save();
        return res.json({message:"User registered successfully"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
    
}

export const login=async(req,res)=>{

  try{
  const {email,password}=req.body;

  if(!email || !password){
    return res.status(400).json({message:"All fields are required"});
  }

  const user=await User.findOne({email});

  if(!user){
    return res.status(404).json({message:"User does not exist"});
  }

  const isMatch=await bcrypt.compare(password,user.password);

  if(!isMatch){
    return res.status(400).json({message:"Invalid credentials"});
  }
  
  // ✅ JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },   // payload
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  return res.json({token:token});
}
catch(err){
    return res.status(500).json({message:err.message});
  }
}

 export const uploadProfilePicture=async(req,res)=>{
   try{
     
      const userId = req.user.id;   // JWT se aaya
        
      if(req.file){
        const imageUrl= await uploadToCloudinary(
          req.file.buffer,
          "linkedin_clone/profile_pictures"
        )

        await User.updateOne(
         { _id: userId },
         { profilePicture: imageUrl }
        );
      }
       

     return res.json({message:"Profile picture uploaded successfully"});
   }
   catch(err){
    return res.status(500).json({message:err.message});
   }

 } 

 export const updateUserProfile=async(req,res)=>{
     try{
        const userId = req.user.id;      // JWT se
        const newUserData = req.body;    // baaki fields same
        
    
       const {username,email}=newUserData;

       const existingUser=await User.findOne({$or:[{username},{email}],_id:{$ne:userId}});

      
       await User.updateOne({ _id: userId }, newUserData);

       return res.json({message:"User profile updated successfully"});
     }
     catch(error){
      return res.status(500).json({message:error.message});
     }
 }

 export const getUserAndProfile=async(req,res)=>{

    try{
      const userId=req.user.id;

      const userProfile=await Profile.findOne({userId:userId})
      .populate('userId','name username email profilePicture').lean();
       
      if (!userProfile) {
         return res.status(404).json({ message: "Profile not found" });
       }

      return res.json(userProfile);
    }
    catch(err){
      return res.status(500).json({message:err.message});
    }
 }

 export const updateProfileData=async(req,res)=>{
    try{
      const userId = req.user.id;
      const newProfileData=req.body;
     
      const userProfile=await User.findById(userId);

      if(!userProfile){
        return res.status(404).json({message:"User not found"});
      }

      const profile_to_update=await Profile.findOne({userId});

       if (!profile_to_update) {
         return res.status(404).json({ message: "Profile not found" });
       }

      await Profile.updateOne({ userId }, newProfileData);

      return res.json({message:"Profile data updated successfully"});
    }
    catch(err){
      return res.status(500).json({message:err.message});
    }
 }

 
 export const getAllUsersProfiles = async (req, res) => {
  try {

       let {name,page=1,limit=5}=req.query;
         
       const skip=(page-1)*limit;

       let matchStage={};

       if(name && name.trim() !== ""){
         matchStage={
            name:{$regex : name , $options : "i"},
         };
       }
    const profiles = await Profile.find()
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'userId',
        select: 'name username email profilePicture',
        match:matchStage,
      });

    // Remove null populated results
    const filteredProfiles = profiles.filter(p => p.userId !== null);

    return res.json({ profiles: filteredProfiles });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

 export const downloadUserProfile=async(req,res)=>{
     
     try {

       const user_id = req.query.id;

       const userProfile = await Profile.findOne({ userId: user_id })
         .populate("userId", "name username email profilePicture");

       if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
       }

       const outputPath = await convertUserDataToPDF(userProfile);

       return res.json({ message: outputPath });
      } 
      catch (err) {
       return res.status(500).json({ message: err.message });
       }
 }

 export const sendConnectionRequest=async(req,res)=>{


     try{

         const userId = req.user.id;
         const { connectionId } = req.body;
         

        if (String(userId) === String(connectionId)) {
          return res.status(400).json({ message: "You cannot send connection request to yourself" });
        }

        const connectionUser=await User.findById(connectionId);

        if(!connectionUser){
          return res.status(404).json({message:"Connection user not found"});
        }

        const existingRequest = await ConnectionRequest.findOne({
          $or: [
            { userId, connectionId },
            { userId: connectionId, connectionId: userId }
          ]
        });

        if(existingRequest){
          return res.status(400).json({message:"Connection request already sent"});
        }

        await ConnectionRequest.create({ userId, connectionId });

        const newRequest = await ConnectionRequest.findOne({
         userId,
         connectionId,
        })
       .populate("userId", "name username email profilePicture")
       .populate("connectionId", "name username email profilePicture");

        return res.json(newRequest);

     }
     catch(err){
      return res.status(500).json({message:err.message});
     }

 }

 export const getMyConnectionRequest=async(req,res)=>{
   

   try{
       const userId = req.user.id;
    
      const connections=await ConnectionRequest.find({userId })
       .select("connectionId status")
       .populate('connectionId','name username email profilePicture')
       .populate("userId", "name username email profilePicture");

    return res.json({connections});
    
   }
   catch(err){
    return res.status(500).json({message:err.message});
   }
 }

 export const getIncomingConnectionRequests=async(req,res)=>{
   
    
    try{
        
         const userId = req.user.id;

        const connections=await ConnectionRequest.find({connectionId:userId})
        .populate('userId','name username email profilePicture')
        .populate("connectionId", "name username email profilePicture");

        return res.json({connections});
    }
    catch(err){
      return res.status(500).json({message:err.message});
    }
 } 


 export const acceptConnectionRequest=async(req,res)=>{
    
    try{
        
        const userId=req.user.id;
        const {requestId,action_type}=req.body;
        
        const connection= await ConnectionRequest.findById(requestId);

        if(!connection){
          return res.status(404).json({message:"Connection request not found"});
        }
        
        // ensure request is actually for this user
         if (String(connection.connectionId) !== String(userId)) {
          return res.status(403).json({ message: "Not authorized" });
         }

         connection.status = action_type === "accept";
         await connection.save();

         const updated = await ConnectionRequest.findById(requestId)
         .populate("userId", "name username email profilePicture")
         .populate("connectionId", "name username email profilePicture");

         return res.json(updated);
  
    }
    catch(err){
      return res.status(500).json({message:err.message});
    }
 }  


 export const removeConnection=async(req,res)=>{
    try{
        
        const myId=req.user.id;
        const {targetUserId}=req.params;

        const connection = await ConnectionRequest.findOne({
         $or: [
          { userId: myId, connectionId: targetUserId },
          { userId: targetUserId, connectionId: myId },
         ],
        status: true, 
       });


         if(!connection){
          return res.status(404).json({ message: "Connection not found" });
        }

        await ConnectionRequest.findByIdAndDelete(connection._id);

        return res.json({ message: "Connection removed" });
    }
    catch(err){
      return res.status(500).json({message:err.message});
    }
 }

export const getUserProfileAndUserBasedOnUsername=async (req,res)=>{

  const {username}=req.query;

  try{
   
    const user= await User.findOne({username});

    if(!user){
      return res.status(404).json({message:"User Not Found"});
    }

    const userProfile=await Profile.findOne({userId:user._id})
    .populate("userId","name username email profilePicture");

    return res.json({"profile":userProfile});
  }
  catch(err){
    return res.status(404).json({message:err.message})
  }
}

export const updateCoverImage=async(req,res)=>{
  try{
 
    const userId=req.user.id;
    
    if(!req.file){
      return res.status(400).json({ message: "Cover image is required"});
    }

    const coverImageUrl=await uploadToCloudinary(
       req.file.buffer,
       "linkedin_clone/cover_images"
    );

    await Profile.updateOne({userId},{ coverImage: coverImageUrl });

    return res.status(200).json({ message: "Cover image updated successfully", coverImageUrl })

  }
  catch(err){
   return res.status(404).json({message:err.message})
  }
}