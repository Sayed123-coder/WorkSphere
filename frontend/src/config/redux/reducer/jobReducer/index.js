import { createSlice } from "@reduxjs/toolkit";
import { createJob, getAllJobs, getJobById, getMyJobs } from "../../action/jobAction/index.js";

const initialState= {
    jobs: [],
    loading: false,
    error: null,
    currentJob:null,
    createLoading: false,
    createError: null,
    createSuccess: false,
  };

  const jobSlice=createSlice({
    name:"job",
    initialState,
    reducers: {
        resetCreateState: (state) => {
         state.createSuccess = false;
         state.createError = null;
         state.createLoading = false;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllJobs.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getAllJobs.fulfilled,(state,action)=>{
            state.loading=false;
            state.jobs=action.payload;
        })
        .addCase(getAllJobs.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(getJobById.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getJobById.fulfilled,(state,action)=>{
            state.currentJob=action.payload;
        })
        .addCase(getJobById.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(getMyJobs.pending,(state)=>{
            state.loading=true;
            state.error = null;
        })
        .addCase(getMyJobs.fulfilled,(state,action)=>{
            state.loading=false;
            state.jobs=action.payload;
        })
        .addCase(getMyJobs.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(createJob.pending,(state)=>{
             state.createLoading = true;
             state.createError = null;
             state.createSuccess = false;
        })
        .addCase(createJob.fulfilled,(state,action)=>{
            state.createLoading=false;
            state.createSuccess=true;
        })
        .addCase(createJob.rejected,(state,action)=>{
            state.createLoading = false;
            state.createError = action.payload;
        })
    }
  });

  export const { resetCreateState } = jobSlice.actions;
  export default jobSlice.reducer;