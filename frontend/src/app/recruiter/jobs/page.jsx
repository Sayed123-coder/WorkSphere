"use client";

import styles from "./recruiterJobs.module.css";
import { getMyJobs } from "@/config/redux/action/jobAction";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

export default function RecruiterJobsPage() {
  const { jobs, loading } = useSelector((state) => state.job);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            
            <div className={styles.header}>
              <div className={styles.title}>My Posted Jobs</div>

              <Link href="/recruiter/jobs/create">
                <button className={styles.postBtn}>Post New Job</button>
              </Link>
            </div>

            {jobs?.length === 0 && (
             <div className={styles.emptyState}>
                <p>No jobs posted yet!</p>
              <Link href="/recruiter/jobs/create">
               <button className={styles.postBtn}>Post Your First Job</button>
               </Link>
             </div>
            )}

            {jobs?.map((job) => (
              <div key={job._id} className={styles.card}>
                
                <img
                  src={job.companyLogo}
                  alt="logo"
                  className={styles.logo}
                />

                <div className={styles.jobInfo}>
                  <div className={styles.jobTitle}>{job.title}</div>
                  <div className={styles.company}>{job.company}</div>
                  <div className={styles.meta}>
                    {job.location} • {job.salary}
                  </div>

                  <div className={styles.badges}>
                    {job.jobType && (
                      <span className={styles.badge}>{job.jobType}</span>
                    )}
                    {job.experienceLevel && (
                      <span className={styles.badge}>
                        {job.experienceLevel}
                      </span>
                    )}
                  </div>
                </div>

                <Link href={`/recruiter/jobs/${job._id}`}>
                  <button className={styles.viewBtn}>
                    View Applicants
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}