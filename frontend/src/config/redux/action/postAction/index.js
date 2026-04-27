import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const  getAllPosts=createAsyncThunk(
    "post/getAllPosts",
    async(_,thunkAPI)=>{
        try{
            const response = await clientServer.get("/posts");
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response?.data)
        }
    }
)

export const createPosts=createAsyncThunk(
    "post/createPost",
    async(userData,thunkAPI)=>{
        const{file,body}=userData;
        try {
            
            const formData=new FormData();
            formData.append("body",body);
            formData.append("media",file);

            const response=await clientServer.post("/post",formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            });

            if(response.status === 201){
                return thunkAPI.fulfillWithValue("Post Uploaded")
            }
            else{
                return thunkAPI.rejectWithValue("Post Not Uploaded")
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)
    
export const deletePost=createAsyncThunk(
    "post/deletePost",
    async(postId,thunkAPI)=>{
       try{
         
        const response=await clientServer.delete("/delete_post",{
            data:{
              postId:postId        
            }
        })
        return thunkAPI.fulfillWithValue(response.data)
       }
       catch(err){
        return thunkAPI.rejectWithValue(err.response.data)
       }
    }
) 

export const incrementLike=createAsyncThunk(
    "post/incrementLike",
    async(postId,thunkAPI)=>{
       try{
            
            const response=await clientServer.post("/increment_like",{
                postId:postId
            })

            return thunkAPI.fulfillWithValue(response.data)
       }
       catch(err){
          return thunkAPI.rejectWithValue(err.response.data)
       }
    }
)

export const getAllComments=createAsyncThunk(
    "post/getAllComments",
    async(postData,thunkAPI)=>{
        try {
            
           const response=await clientServer.get("/get_comments",{
            params:{
                postId:postData.post_id
            }
           })
           return thunkAPI.fulfillWithValue({
              comments:response.data,
              post_id:postData.post_id
           })

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const createComment=createAsyncThunk(
    "post/createComment",
    async(commentData,thunkAPI)=>{
        try {
            
           console.log(commentData)

           const response= await clientServer.post("/add_comment",{
            postId:commentData.postId,
            comment:commentData.body
           })

           return thunkAPI.fulfillWithValue(response.data)

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)