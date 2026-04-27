import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllJobs=createAsyncThunk(
    "job/getAllJobs",
    async(filters={},thunkAPI)=>{
        try{
           
            // undefined ya empty values hta deni hai
            const cleanedFilters=Object.fromEntries(
                Object.entries(filters).filter(([_,v])=>v && v.trim() !== "") 
            );

            const params=new URLSearchParams(cleanedFilters).toString();
            const url= params ? `/job?${params}` : "/job";
            const {data}=await clientServer.get(url);
            return thunkAPI.fulfillWithValue(data.jobs);
        }
        catch(err){
          return thunkAPI.rejectWithValue(err.response?.data?.message)
        }
    }
);

export const getJobById=createAsyncThunk(
    "job/getJobById",
    async(id,thunkAPI)=>{
        try{
           
            const {data}=await clientServer.get(`/job/${id}`);
            return thunkAPI.fulfillWithValue(data.job);
        }
        catch(err){
          return thunkAPI.rejectWithValue(err.response?.data?.message)
        }
    }
)

export const getMyJobs=createAsyncThunk(
    "job/getMyJobs",
    async(_,thunkAPI)=>{
        try{
            
            const {data}=await clientServer.get(`/job/my`,
                {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );

            return thunkAPI.fulfillWithValue(data.jobs);
        }
        catch(err){
           return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
)

export const createJob=createAsyncThunk(
    "job/createJob",
    async(form,thunkAPI)=>{
        try{
           
             // FormData bhejenge kyunki ab file upload ho rahi hai
              const formData=new FormData();
              formData.append("title",form.title);
              formData.append("company",form.company);
              formData.append("location",form.location);
              formData.append("salary",form.salary);
              formData.append("description", form.description);
              formData.append("jobType", form.jobType);
              formData.append("experienceLevel", form.experienceLevel);

              // Skills array hai toh loop karo
              form.skills.forEach(skill=>formData.append("skills",skill));

               // File hai toh append karo
              if (form.companyLogo) {
               formData.append("companyLogo", form.companyLogo);
               }

            const {data}=await clientServer.post(
                "/job/create",
                formData,
                {
                 headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "multipart/form-data",
                 },
                }
            );
            return thunkAPI.fulfillWithValue(data.job);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response?.data?.message)
        }
    }
)