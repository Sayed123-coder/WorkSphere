import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import postRoutes from "./routes/post.routes.js"
import userRoutes from "./routes/user.routes.js"
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

const PORT=process.env.PORT || 9000;
const app=express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use("/job",jobRoutes);
app.use("/application",applicationRoutes);
app.use(express.static("uploads"));
const start=async ()=>{
    const connectDB=await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected");

  app.listen(PORT,()=>{
    console.log("App is listening on the server");
  })
}

start();
