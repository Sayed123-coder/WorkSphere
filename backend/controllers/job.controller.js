import Job from "../models/job.model.js";
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js"

// Create Job 

export const createJob= async (req,res)=>{
   
    try{
      const {title,company,location,salary,description,skills,jobType,experienceLevel,}=req.body;

      let companyLogo = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

      if(req.file){
        companyLogo=await uploadToCloudinary(req.file.buffer,"linkedin_clone/company_logos");
      }
      const job= await Job.create({
       title,
       company,
       companyLogo,
       location,
       salary,
       description,
       skills,
       jobType,
       experienceLevel,
       postedBy: req.user.id, // from auth middleware
      });

     res.status(201).json({success:true,job});
    }
    catch(err){
        res.status(500).json({success:false,message:err.message});
    }
}

// Get All Jobs 

// controllers/jobController.js

export const getAllJobs = async (req, res) => {
  try {
    const { search, location, jobType } = req.query;

    let query = {};

    // 🔍 Search by title, skills, company
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    // 📍 Location partial match
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 💼 Job Type partial match
    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("postedBy", "name username profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({jobs});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single job 

export const getJobById = async(req,res)=>{
    try{
      
        const job=await Job.findById(req.params.id)
        .populate("postedBy","name username profilePicture");
        
        return res.status(201).json({job});
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

// My posted jobs 

export const getMyJobs=async(req,res)=>{
    try{
       
        const jobs=await Job.find({ postedBy:req.user.id }).sort({createdAt:-1});
        return res.status(200).json({jobs});
    }
    catch(err){
      return res.status(500).json({message:err.message})
    }
}