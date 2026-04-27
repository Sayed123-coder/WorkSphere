import express from "express";
const router=express.Router();
import {isAuthenticated} from "../middleware/auth.js";
import { createJob, getAllJobs, getJobById, getMyJobs } from "../controllers/job.controller.js";
import upload from "../middleware/multer.js";


router.post("/create",isAuthenticated,upload.single("companyLogo"),createJob);
router.get("/",getAllJobs);
router.get("/my",isAuthenticated,getMyJobs);
router.get("/:id",getJobById);

export default router;


