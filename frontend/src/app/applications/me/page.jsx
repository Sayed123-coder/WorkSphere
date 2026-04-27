"use client";

import { getMyApplications } from "@/config/redux/action/applicationAction";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./myApplications.module.css";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

export default function MyApplicationsPage() {

    const { myApplications, loading } = useSelector((state) => state.application);
    const dispatch = useDispatch();
    const getDownloadUrl = (url) => {
    return url.replace("/upload/", "/upload/fl_attachment/");
}

    useEffect(() => {
        dispatch(getMyApplications())
    }, [dispatch])

    if (loading) return <p>Loading...</p>;

    return (
      <UserLayout>
        <DashboardLayout>
       <div className={styles.wrapper}>
            <h2 className={styles.heading}>Jobs I Applied To</h2>

            {myApplications.length === 0 && (
                <p className={styles.empty}>No applications yet!</p>
            )}

            {myApplications.map((app) => (
                <div key={app._id} className={styles.card}>

                    {/* Header */}
                    <div className={styles.header}>
                        <img src={app.job.companyLogo} alt="logo" className={styles.logo} />
                        <div>
                            <h3 className={styles.title}>{app.job.title}</h3>
                            <p className={styles.company}>{app.job.company}</p>
                            <p className={styles.meta}>{app.job.location} • {app.job.salary}</p>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className={styles.badges}>
                        {app.job.jobType && (
                            <span className={styles.badge}>{app.job.jobType}</span>
                        )}
                        {app.job.experienceLevel && (
                            <span className={styles.badge}>{app.job.experienceLevel}</span>
                        )}
                        <span className={`${styles.badge} ${styles[app.status]}`}>
                            {app.status}
                        </span>
                    </div>

                    {/* Skills */}
                    {app.job.skills?.length > 0 && (
                        <div className={styles.skills}>
                            {app.job.skills.map((skill, i) => (
                                <span key={i} className={styles.skill}>{skill}</span>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p className={styles.date}>
                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </p>

                    </div>

                </div>
            ))}
        </div>
        </DashboardLayout>
        </UserLayout>
    );
}