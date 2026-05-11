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

const allowedOrigins = [
  "http://localhost:5173",          
  "http://localhost:3000",          
  "https://work-sphere-lemon.vercel.app", ];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());
app.use(express.static("uploads"));

app.get("/", (req, res) => {
  res.status(200).send("API is running...");
});

app.use(postRoutes);
app.use(userRoutes);
app.use("/job",jobRoutes);
app.use("/application",applicationRoutes);

const start=async ()=>{
    const connectDB=await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected");

  app.listen(PORT,()=>{
    console.log("App is listening on the server");
  })
}

start();
