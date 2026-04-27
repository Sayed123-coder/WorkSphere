"use client"

import React, { useEffect, useState } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/navigation';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authAction';
// import { getMyJobs } from '@/config/redux/action/jobAction';

export default function DashboardLayout({children}) {
  const router=useRouter();
  const authState=useSelector((state)=>state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const dispatch=useDispatch();
   useEffect(()=>{
        if(!localStorage.getItem("token")){
          router.push("/login");
        } else {
          dispatch(setTokenIsThere(true));
          dispatch(getAllUsers({ query: "", page: 1 }));
        }
      },[]);

  return (
    <div>
        <div className="container">
         
        <div className={styles.homeContainer}>

         <div className={styles.homeContainer_left}>

          <div onClick={()=>{
            router.push("/dashboard");
          }} className={styles.sideBarOptions}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <p>Home</p>
          </div>
          
          <div onClick={()=>{
            router.push("/discover")
          }} className={styles.sideBarOptions}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <p>Discover</p>
          </div>

          <div onClick={()=>{
            router.push("/my_connections")
          }} className={styles.sideBarOptions}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>


            <p>My Connections</p>
          </div>

           <div
            onClick={() => {
             router.push("/jobs");
           }}
           className={styles.sideBarOptions}
           >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
          <p>Jobs</p>
         </div>

         <div
            onClick={() => {
            router.push("/recruiter/jobs");
           }}
           className={styles.sideBarOptions}
           >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6"
           strokeLinecap="round" strokeLinejoin="round">
           <rect x="3" y="7" width="18" height="13" rx="2"></rect>
           <path d="M9 7V5a3 3 0 0 1 6 0v2"></path>
           <path d="M8 12h8"></path>
           <path d="M8 15h5"></path>
           <path d="M16 15l1.5 1.5L20 14"></path>
          </svg>
          <p>My Jobs</p>
         </div>

         </div>

         <div className={styles.homeConatiner_feedConatiner}>
            {children}
        </div>

        <div className={styles.homeContainer_extraContainer}>
          <h3>Top Users</h3>
          {authState.all_profiles_fetched &&
           authState.all_users
           .filter(profile => profile.userId)
           .map(profile => (
             <div key={profile._id} className={styles.extraContainer_profiles}>
              <p>{profile.userId.name}</p>
             </div>
          ))}
        </div>
        

        </div>
        
        <div className={styles.mobileNavbar}>
          
           <div onClick={()=>{
            router.push("/dashboard");
          }}  className={styles.singleNavItemHolder_mobileView}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
           </div>

           <div onClick={()=>{
            router.push("/discover")
          }}  className={styles.singleNavItemHolder_mobileView}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
           </div>

           <div onClick={()=>{
            router.push("/my_connections")
          }}  className={styles.singleNavItemHolder_mobileView}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
           </div>

           <div
             onClick={() => {
             router.push("/jobs");
             }}
             className={styles.singleNavItemHolder_mobileView}
           >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
       </div>

       <div
             onClick={() => {
             router.push("/recruiter/jobs");
             }}
             className={styles.singleNavItemHolder_mobileView}
           >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6"
           strokeLinecap="round" strokeLinejoin="round">
           <rect x="3" y="7" width="18" height="13" rx="2"></rect>
           <path d="M9 7V5a3 3 0 0 1 6 0v2"></path>
           <path d="M8 12h8"></path>
           <path d="M8 15h5"></path>
           <path d="M16 15l1.5 1.5L20 14"></path>
          </svg>
       </div>

       <div
        onClick={() => setIsDrawerOpen(true)}
        className={styles.singleNavItemHolder_mobileView}
       >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
     </svg>
    </div>

        </div>

        {/* Mobile Drawer */}
        {isDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}>
        <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
      
        <div className={styles.drawerItem} onClick={() => { router.push("/profile"); setIsDrawerOpen(false); }}>
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
         </svg>
         <p>Profile</p>
        </div>

      <div className={styles.drawerItem} onClick={() => { router.push("/applications/me"); setIsDrawerOpen(false); }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15" />
        </svg>
        <p>My Applications</p>
      </div>

      <div className={styles.drawerItem} onClick={() => {
        localStorage.removeItem("token");
        router.push("/login");
        dispatch(reset());
        setIsDrawerOpen(false);
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        <p style={{color:"red"}}>Logout</p>
      </div>

    </div>
  </div>
)}

    </div>

    </div>
  )
}
