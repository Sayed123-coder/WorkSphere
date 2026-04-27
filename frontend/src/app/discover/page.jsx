"use client";

import { BASE_URL } from '@/config';
import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./discover.module.css";
import { useRouter } from 'next/navigation';

export default function DiscoverPage() {
    const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const [query,setQuery]=useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
  if (!authState.user) {
    dispatch(getAboutUser());
  }
}, [authState.user, dispatch]);

  useEffect(() => {
    if ( authState.user?.userId?._id){
      dispatch(getAllUsers({query,page}));
    }
  }, [authState.user, page, query, dispatch]);

  useEffect(()=>{
      const delay=setTimeout(()=>{
          setPage(1);// reset page
          dispatch(getAllUsers({query,page:1}))
      },400)
      return () => clearTimeout(delay);
  },[query])


  // ✅ Guard yaha lagao (hooks ke baad)
  if (!authState.user) {
     return <div>Loading user...</div>;
  }

  const filteredUsers = authState.all_users.filter(
    (item) => item.userId?._id !== authState.user?.userId?._id
  );
  return (
    <UserLayout>
     <DashboardLayout>
      <div>
        <h1>DiscoverPage</h1>

         <div className={styles.searchWrapper}>
           <input
            className={styles.searchInput}
            placeholder="Search someone you know..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
           />
        </div>

        <div className="allUserProfile">
          {filteredUsers.map((item)=>{
            const user = item.userId;
            return(
              <div onClick={()=>{
                 router.push(`/view_profile/${user.username}`)
              }} key={user._id} className={styles.userCard}>
                <img className={styles.userCard_image} src={user.profilePicture} alt="" />
                <div>
                  <h1>{user.name}</h1>
                  <p>{user.username}</p>
                </div>
              </div>
            )
          })}
        </div>


        {/* Load More */}
        {authState.all_users.length >= 5 && (
         <div className={styles.loadMoreWrapper}>
           <button
            className={styles.loadMoreBtn}
            disabled={authState.isLoading}
            onClick={() => setPage((prev) => prev + 1)}
           >
             {authState.isLoading ? "Loading..." : "Load More"}
           </button>
        </div>
       )}
      </div>
     </DashboardLayout>
    </UserLayout>
  )
}
