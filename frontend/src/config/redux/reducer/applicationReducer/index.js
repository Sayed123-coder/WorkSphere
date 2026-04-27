import { createSlice } from "@reduxjs/toolkit";
import { applyToJob, getApplicantsForJob, getMyApplications, updateApplicationStatus } from "../../action/applicationAction";

const initialState={
     loading: false,
     success: false,
     error: null,
     applicants:[],
     myApplications:[],
}

const applicationSlice=createSlice({
    name:"application",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(applyToJob.pending,(state)=>{
            state.loading=true;
        })
        .addCase(applyToJob.fulfilled,(state)=>{
            state.loading=false;
            state.success=true;
        })
        .addCase(applyToJob.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(getApplicantsForJob.pending,(state,action)=>{
            state.loading=true;
        })
        .addCase(getApplicantsForJob.fulfilled,(state,action)=>{
            state.applicants=action.payload;
        })
        .addCase(getApplicantsForJob.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(updateApplicationStatus.pending,(state,action)=>{
            state.loading=true;
        })
        .addCase(updateApplicationStatus.fulfilled,(state,action)=>{
            state.loading=false;
            const updated=action.payload;

            state.applicants=state.applicants.map((app)=>app._id === updated._id ? updated : app);
        })
        .addCase(updateApplicationStatus.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(getMyApplications.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getMyApplications.fulfilled,(state,action)=>{
            state.loading=false;
            state.myApplications=action.payload;
        })
        .addCase(getMyApplications.rejected,(state,action)=>{
              state.loading=false;
              state.error=action.payload;
        })
    }
})

export default applicationSlice.reducer;