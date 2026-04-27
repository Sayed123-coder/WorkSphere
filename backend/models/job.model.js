import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true,
  },

  company: {
    type: String,
    required: true,
    trim: true,
  },

  companyLogo: {
    type: String,   // URL
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },

  location: {
    type: String,
    required: true,
    trim: true,
  },

  salary: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  skills: [
    {
      type: String,
      trim: true,
    },
  ],

  jobType: {
    type: String, // Full-time | Part-time | Internship | Remote
  },

  experienceLevel: {
    type: String, // Fresher | 1-3 yrs | 3-5 yrs
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},
{ timestamps: true }
);

// Indexes for performance
jobSchema.index({ postedBy: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ location: 1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;