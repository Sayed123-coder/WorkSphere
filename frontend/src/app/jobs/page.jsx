"use client";

import { getAllJobs } from "@/config/redux/action/jobAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./jobs.module.css";
import { formatDistanceToNow } from "date-fns";
import { JobShimmer } from "@/components/Shimmer/shimmerEffect";

export default function JobsPage() {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.job);

  // ✅ filters ko state me rakho
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
  });

  // first load
  useEffect(() => {
    dispatch(getAllJobs({}));
  }, []);

  // whenever filters change
  useEffect(() => {
    dispatch(getAllJobs(filters));
  }, [filters]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h1 className={styles.title}>Available Jobs</h1>

          {/*  FILTERS SECTION */}
          <div className={styles.filters}>
            <input
              placeholder="Search jobs or skills..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />

            <select
              value={filters.jobType}
              onChange={(e) =>
                setFilters({ ...filters, jobType: e.target.value })
              }
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>

            <input
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
          </div>
          

          {/*  JOB LIST */}
          {jobs?.map((job) => (
            <div key={job._id} className={styles.card}>
              <div className={styles.header}>
                <div className={styles.left}>
                  <img
                    src={job.companyLogo || "/defaultCompany.png"}
                    alt="logo"
                    className={styles.logo}
                  />

                  <div>
                    <h3>{job.title}</h3>
                    <p className={styles.company}>{job.company}</p>
                    <p className={styles.meta}>
                      {job.location} • {job.jobType} •{" "}
                      {job.experienceLevel}
                    </p>
                    <p className={styles.time}>
                      Posted{" "}
                      {formatDistanceToNow(
                        new Date(job.createdAt)
                      )}{" "}
                      ago
                    </p>
                  </div>
                </div>

                <span className={styles.salary}>{job.salary}</span>
              </div>

              <div className={styles.skills}>
                {job.skills.map((skill, i) => (
                  <span key={i} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>

              <Link href={`/jobs/${job._id}`}>
                <button className={styles.button}>
                  View Details / Apply
                </button>
              </Link>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}