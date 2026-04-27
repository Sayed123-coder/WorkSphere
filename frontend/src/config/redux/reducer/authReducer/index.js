import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequest, getProfileByUsername, loginUser, registerUser, removeConnection } from "../../action/authAction"
import { createSlice } from "@reduxjs/toolkit"

const initialState={
    user:null,
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    isTokenThere:false,
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    all_profiles_fetched:false,
    viewedProfile: null
}

const authSlice= createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message="Hello"
        },
        emptyMessage:(state)=>{
            state.message=""
        },
        setLoggedInFromToken: (state) => {
            state.loggedIn = true;
        },
        setTokenIsThere:(state)=>{
            state.isTokenThere=true;
        },
        setTokenIsNotThere:(state)=>{
            state.isTokenThere=false;
        }
    },

    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true;
            state.message="Knocking the door...";
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.loggedIn=true;
            state.message="Login is successfull"
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true;
            state.message="Registering the user...";
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.loggedIn=false;
            state.message="Registration is successfull.Please login."
            
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;

        })
        .addCase(getAboutUser.pending,(state)=>{
           state.isLoading = true;
           state.profileFetched = false;
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.profileFetched=true;
            state.user=action.payload;
        })
        .addCase(getAboutUser.rejected,(state,action)=>{
             state.isLoading = false;
             state.isError = true;
             state.profileFetched = false;
             state.message = action.payload;
          })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
             state.isLoading = false;
             state.isError = false;
             state.all_profiles_fetched=true;
              if (action.payload.page === 1) {
             // search ya first load
              state.all_users = action.payload.profiles;
            } else {
            // load more
           state.all_users = [...state.all_users, ...action.payload.profiles];
           }
        })
        .addCase(getProfileByUsername.pending, (state) => {
              state.isLoading = true;
              state.profileFetched = false;
        })

        .addCase(getProfileByUsername.fulfilled, (state, action) => {
           state.viewedProfile = action.payload;
           state.isLoading = false;
           state.profileFetched = true;
           state.isError = false;
        })

        .addCase(getProfileByUsername.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })

        .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
            state.connections=action.payload;
        })

        .addCase(getConnectionsRequest.rejected,(state,action)=>{
            state.message=action.payload
        })

        .addCase(getMyConnectionRequest.fulfilled,(state,action)=>{
            state.connectionRequest=action.payload
        })

        .addCase(getMyConnectionRequest.rejected,(state,action)=>{
            state.message=action.payload
        })
        .addCase(removeConnection.pending,(state)=>{
            state.isLoading=true;
        })
        .addCase(removeConnection.fulfilled,(state,action)=>{
            state.isLoading=false;
        })

        .addCase(removeConnection.rejected,(state,action)=>{
            state.isLoading=false;
            state.message=action.payload
        })
        
    }
})


export const {reset,emptyMessage,setLoggedInFromToken,setTokenIsThere,setTokenIsNotThere}=authSlice.actions ;
export default authSlice.reducer;