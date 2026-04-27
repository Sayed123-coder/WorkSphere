import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const loginUser=createAsyncThunk(
    "auth/login",
    async (user,thunkAPI) => {
        try{

            const response=await clientServer.post("/login",{
            email: user.email,
            password: user.password
           });

           if(response.data.token){
            localStorage.setItem("token",response.data.token);
           }
           else{
            return thunkAPI.rejectWithValue("Token not provided");
           }

           return response.data.token;
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response?.data?.message|| "Login failed");
        }
    }
)


export const registerUser= createAsyncThunk(
    "auth/register",
    async (user,thunkAPI)=>{
        try{
           
            const response= await clientServer.post("/register",{
                username:user.username,
                name:user.name,
                email:user.email,
                password:user.password,
            });
            return "Registration successful. Please login.";
        } 
        catch(err){
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(_,thunkAPI)=>{
        try{
           const response= await clientServer.get("/get_user_and_profile")
         
           return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const getAllUsers=createAsyncThunk(
    "user/getAllUsers",
    async({query="",page=1},thunkAPI)=>{
        try {

            const response=await clientServer.get("/user/get_all_users",{
               params: { name:query,page,limit:5 },
            })

            return thunkAPI.fulfillWithValue({
             profiles: response.data.profiles,
             page: page,
            });
            
        } catch (err) {
           return thunkAPI.rejectWithValue(err.response.data) 
        }
    }
)

export const getProfileByUsername = createAsyncThunk(
  "auth/getProfileByUsername",
  async (username, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/get_profile_based_on_username",
        {
          params: { username }
        }
      );

      return response.data.profile;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const sendConnectionRequest=createAsyncThunk(
  "user/sendConnectionRequest",
  async({connectionId},thunkAPI)=>{
    try{
      const response=await clientServer.post("/user/send_connection_request",
        {connectionId }
     );
       
       thunkAPI.dispatch(getConnectionsRequest())

      return thunkAPI.fulfillWithValue(response.data)
    }
    catch(err){
     return thunkAPI.rejectWithValue(err.response.data.message)
    }
  }  
)

export const getConnectionsRequest=createAsyncThunk(
    "user/getConnectionsRequest",
    async(_,thunkAPI)=>{
        
        try{
             const response= await clientServer.get("/user/getConnectionRequests")
             return thunkAPI.fulfillWithValue(response.data.connections);
           }
        catch(err){
         return thunkAPI.rejectWithValue(err.response.data.message);
        }
        
    }
)

export const getMyConnectionRequest=createAsyncThunk(
    "user/getMyConnectionRequest",
    async (_,thunkAPI)=>{
        try{
            
            const response=await clientServer.get("/user/user_connection_request")
            return thunkAPI.fulfillWithValue(response.data.connections)
        }
        catch(err){
          return thunkAPI.rejectWithValue(err.response.data.message)
        }
    }
)

export const acceptConnection = createAsyncThunk(
    "user/acceptConnection",
    async({requestId,action_type},thunkAPI)=>{
       try{
         const response=await clientServer.post("/user/accept_connection_request",
            {requestId,action_type}
        )

         thunkAPI.dispatch(getConnectionsRequest())
         thunkAPI.dispatch(getMyConnectionRequest())
         return thunkAPI.fulfillWithValue(response.data)
       }
       catch(err){
        return thunkAPI.rejectWithValue(err.response.data)
       }
    }
)

export const removeConnection = createAsyncThunk(
  "auth/removeConnection",
  async (targetUserId, thunkAPI) => {
    try {
      const response = await clientServer.delete(
        `/user/remove_connection/${targetUserId}`,
      );

      thunkAPI.dispatch(getConnectionsRequest());
      thunkAPI.dispatch(getMyConnectionRequest());

      return thunkAPI.fulfillWithValue(response.data.message);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Remove failed"
      );
    }
  }
);