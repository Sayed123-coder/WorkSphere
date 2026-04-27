
/*
* STEPS for State Management
* Submit Action 
* Handle action in it's reducer
* Register the reducer here
*
*/

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
import jobReducer from "./reducer/jobReducer/index.js";
import applicationReducer from "./reducer/applicationReducer/index.js"

export const store = configureStore({
    reducer:{
        auth:authReducer,
        post:postReducer,
        job:jobReducer,
        application:applicationReducer,
    }
})