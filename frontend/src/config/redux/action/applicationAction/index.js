import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const applyToJob=createAsyncThunk(
    "application/applyToJob",
     async (formData,thunkAPI) => {
         try{

            const {data}=await clientServer.post(
                "/application/apply",
                 formData,
                 {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                 }
            );
            return thunkAPI.fulfillWithValue(data);
         }
         catch(err){
            return thunkAPI.rejectWithValue(err.response?.data?.message);
         }
     }
)


export const getApplicantsForJob=createAsyncThunk(
    "application/getApplicantsForJob",
    async(jobId,thunkAPI)=>{
        try{
            
          const {data}=await clientServer.get(
            `application/job/${jobId}`,
            {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
          );

          return thunkAPI.fulfillWithValue(data.applications);

        }
        catch(err){
           return thunkAPI.rejectWithValue(err.response?.data?.message)
        }
    }

)

export const updateApplicationStatus=createAsyncThunk(
    "application/updateApplicationStatus",
    async({applicationId,status},thunkAPI)=>{
        try{
           
            const {data}=await clientServer.put(
                `application/status/${applicationId}`,
                    {status},    
                    {
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    }
            );

            return thunkAPI.fulfillWithValue(data.application)
        }
        catch(err){
          return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
)


export const getMyApplications=createAsyncThunk(
    "application/getMyApplications",
    async(_,thunkAPI)=>{
        try{

            const {data}= await clientServer.get(
                "/application/me",
                {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );

            return thunkAPI.fulfillWithValue(data.applications);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
)