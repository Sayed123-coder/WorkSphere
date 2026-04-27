"use client";

import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import styles from "./style.module.css";
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import { setLoggedInFromToken } from "@/config/redux/reducer/authReducer";
import { toast } from "react-toastify";

function LoginComponent() {
  const authState=useSelector((state)=>state.auth)
  const router=useRouter();
  const [userLoginMethod,setUserLoginMethod]=useState(false);

  const [email,setEmail]=useState("");
  const [name,setName]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const dispatch=useDispatch();

useEffect(() => {
  if (localStorage.getItem("token")) {
    dispatch(setLoggedInFromToken());
  }
}, []);

// useEffect mein - success
useEffect(() => {
  if (authState.isSuccess && !userLoginMethod) {
    toast.success("Account created successfully! 🎉");
    setUsername(""); setName(""); setEmail(""); setPassword("");
  }
}, [authState.isSuccess, userLoginMethod]);

// useEffect mein - error
useEffect(() => {
  if (authState.isError && authState.message) {
    toast.error(typeof authState.message === "string"
      ? authState.message
      : authState.message?.message
    );
  }
}, [authState.isError]);

  useEffect(()=>{
    if(authState.loggedIn){
      toast.success("Welcome back! 👋");
      router.replace("/dashboard");
    }
  },[authState.loggedIn,router])

//   useEffect(() => {
//   if (authState.isSuccess && !userLoginMethod) {
//     setUsername("");
//     setName("");
//     setEmail("");
//     setPassword("");
//   }
// }, [authState.isSuccess, userLoginMethod]);

useEffect(()=>{
 dispatch(emptyMessage())
},[userLoginMethod,dispatch])


  
  const handleRegister=()=>{
    console.log("Registering...");
    dispatch(registerUser({
      username,
      name,
      email,
      password,
    }));
    setUserLoginMethod(!userLoginMethod);
  }

  const handleLogin=()=>{
   console.log("Logging In...");
   dispatch(loginUser({email,password}))
  }
  return (
     <UserLayout>
    <div className={styles.container}>
      <div className={styles.authCard}>

        <p className={styles.title}>
          {userLoginMethod ? "Sign In" : "Create your account"}
        </p>

        {/* <p className={styles.message}
           style={{color: authState.isError ? "#d93025" : "#188038"}}>
          {typeof authState.message === "string"
            ? authState.message
            : authState.message?.message}
        </p> */}

        <div className={styles.form}>

          {!userLoginMethod && (
            <div className={styles.row}>
              <input
                onChange={(e)=>setUsername(e.target.value)}
                value={username}
                placeholder="Username"
              />
              <input
                onChange={(e)=>setName(e.target.value)}
                value={name}
                placeholder="Full Name"
              />
            </div>
          )}

          <input
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            placeholder="Email address"
          />

          <input
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />

          <button
            className={styles.primaryBtn}
            onClick={userLoginMethod ? handleLogin : handleRegister}
          >
            {userLoginMethod ? "Sign In" : "Sign Up"}
          </button>

          <div className={styles.switchText}>
            {userLoginMethod
              ? "Don't have an account?"
              : "Already have an account?"}
            <span onClick={()=>setUserLoginMethod(!userLoginMethod)}>
              {userLoginMethod ? " Sign Up" : " Sign In"}
            </span>
          </div>

        </div>
      </div>
    </div>
  </UserLayout>
  )
}

export default LoginComponent;