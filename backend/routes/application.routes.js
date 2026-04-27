import express from "express";
const router=express.Router();
import { isAuthenticated } from "../middleware/auth.js";
import { applyJob, getJobApplications, getMyApplication, updateApplicationStatus } from "../controllers/application.controller.js";
import upload from "../middleware/multer.js"


router.post("/apply",isAuthenticated,upload.single("resume"),applyJob);
router.get("/job/:jobId",isAuthenticated,getJobApplications);
router.get("/me",isAuthenticated,getMyApplication);
router.put("/status/:applicationId",isAuthenticated,updateApplicationStatus);

export default router;