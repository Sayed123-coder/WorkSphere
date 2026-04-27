import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import {uploadToCloudinary} from "../utils/uploadToCloudinary.js";

// Apply to a job

  export const applyJob= async(req,res)=>{
    try{
       
        const {jobId,coverLetter,name, email, phone }=req.body;

        const job = await Job.findById(jobId);

        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }

        if (job.postedBy.toString() === req.user.id) {
          return res.status(400).json({
          message: "You cannot apply to your own job",
        });
        }

        const alreadyApplied=await Application.findOne({
            job:jobId,
            applicant:req.user.id,
        })

        if(alreadyApplied){
            return res.status(400).json({
                success:false,
                messgae:"You have already applied to this job",
            });
        }

         //  Resume cloudinary pe upload
        if (!req.file) {
          return res.status(400).json({ message: "Resume is required" });
         }
         
         const fileName = req.file.originalname;

         const sanitizedName = fileName.replace(/\s+/g, '_');
        
          
         const resumeUrl=await uploadToCloudinary(
            req.file.buffer,
            "linkedin_clone/resumes",
            "raw",
            sanitizedName
            
         )
        const application=await Application.create({
            job:jobId,
            applicant:req.user.id,
            name,
            email,
            phone,
            resume: resumeUrl,
            coverLetter,
        })

        return res.status(200).json({
            success:true,
            application,
        })
    }
    catch(err){
     return res.status(500).json({
        success:false,
        message:err.message,
    })
    }
}


//  Get applicants of a job (Recruiter only)

export const getJobApplications=async (req,res)=>{
    try{
        
        const {jobId} = req.params;
        const job = await Job.findById(jobId);

        if (job.postedBy.toString() !== req.user.id) {
          return res.status(403).json({
           success: false,
           message: "Not allowed"
          }); 
        }

        const applications=await Application.find({job:jobId})
        .populate("applicant","name email username profilePicture")
        .sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            applications,
        });

    }
    catch(err){
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
}

//  Get all jobs applied by current user

export const getMyApplication=async(req,res)=>{
    try{
        
        const applications=await Application.find({
            applicant:req.user.id,
        })
        .populate("job")
        .sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            applications,
        })

    }
    catch(err){
      return res.status(500).json({
        success:false,
        message:err.message,
      })
    }
}

//  Update application status

export const updateApplicationStatus=async(req,res)=>{
    try{
        
        const {applicationId}=req.params;
        const {status}=req.body;
        
        const application=await Application.findById(applicationId).populate("job");

        if(!application){
            return res.status(404).json({
                success:false,
                message:"Application not found",
            });
        }

        // only job owner can update

        if(application.job.postedBy.toString() !== req.user.id )
        {
            return res.status(403).json({
                success: false,
                message: "Not allowed",
            });
        }

        application.status=status;
        application.save();

        const populatedApp = await Application.findById(applicationId)
        .populate("applicant", "name email profilePicture");

        return res.status(200).json({
            success:true,
            application:populatedApp,
        })

    }
    catch(err){
       return res.status(500).json({
         success:false,
         message:err.message,
       })
    }
}