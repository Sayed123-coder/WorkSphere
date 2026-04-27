"use client";

import { BASE_URL } from "@/config";
import { getApplicantsForJob, updateApplicationStatus } from "@/config/redux/action/applicationAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./applicants.module.css";

export default function ApplicantsPage() {
    
    const {jobId}=useParams();
    const {applicants}=useSelector((state)=>state.application);
    const dispatch=useDispatch();

      useEffect(()=>{
        dispatch(getApplicantsForJob(jobId));
      },[jobId]);
 
      useEffect(() => {
       document.title = "Applicants | WorkSphere";
      }, []);
     

    //   Filter for applicants 
      const applied=applicants.filter((a)=>a.status === "applied");
      const shortlisted=applicants.filter((a)=>a.status === "shortlisted");
      const rejected=applicants.filter((a)=>a.status === "rejected");

      const handleDownload = async (resumeUrl) => {
       try {
           
         console.log("Fetching URL:", resumeUrl);
         const response = await fetch(resumeUrl, {
          method: 'GET',
          mode: 'cors', // CORS handle karne ke liye
         });

        // Check karein ki kya request success thi
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
       }

       const blob = await response.blob();
    
       // Check karein ki blob ka size kya hai
      console.log("Blob size:", blob.size); 

       if (blob.size === 0) {
          throw new Error("File empty hai (0 KB).");
       }

       // Baaki download logic
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', 'resume.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error("Download Error:", error);
    alert("Download fail ho gaya. Console check karein!");
  }
  };

      // reusable section render

const renderSection = (title, list, showButtons = false) => (
  <div className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>

    {list.length === 0 && (
      <p className={styles.empty}>No applicants here</p>
    )}

    {list.map((app) => (
      <div key={app._id} className={styles.card}>
        <img
          src={app.applicant.profilePicture}
          className={styles.avatar}
        />

        <div className={styles.info}>
          <div className={styles.name}>{app.applicant.name}</div>
          <div className={styles.email}>{app.applicant.email}</div>
          <div
            className={`${styles.badge} ${
            app.status === "applied"
            ? styles.applied
            : app.status === "shortlisted"
            ? styles.shortlisted
            : styles.rejected
          }`}
         >
  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
</div>
        </div>

        {showButtons && (
          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.shortlist}`}
              onClick={() =>
                dispatch(
                  updateApplicationStatus({
                    applicationId: app._id,
                    status: "shortlisted",
                  })
                )
              }
            >
              Shortlist
            </button>

            <button
              className={`${styles.btn} ${styles.reject}`}
              onClick={() =>
                dispatch(
                  updateApplicationStatus({
                    applicationId: app._id,
                    status: "rejected",
                  })
                )
              }
            >
              Reject
            </button>
           <button 
             className={`${styles.btn} ${styles.downloadBtn}`} 
             onClick={() => handleDownload(app.resume)}
            >
            Download Resume
           </button>
          </div>
        )}
      </div>
    ))}
  </div>
);
  return (
    <UserLayout>
      <DashboardLayout>
    <div className={styles.page}>
      
       {renderSection("Applied Applicants",applied,true)}
       {renderSection("Shortlisted Applicants",shortlisted)}
       {renderSection("Rejected Applicants",rejected)}

    </div>
    </DashboardLayout>
    </UserLayout>
  )
}
