"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJob, getMyJobs } from "@/config/redux/action/jobAction";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { resetCreateState } from "@/config/redux/reducer/jobReducer";
import styles from "./createJob.module.css";
import { toast } from "react-toastify";

export default function CreateJobPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { createLoading, createSuccess, createError } =
    useSelector((state) => state.job);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    skills: "",
    jobType: "",
    experienceLevel: "",
    companyLogo:null,
  });

  useEffect(() => {
    if (createSuccess) {
      toast.success("Job posted successfully! 🎉");
      dispatch(getMyJobs());
      dispatch(resetCreateState());
      router.push("/recruiter/jobs");
    }
  }, [createSuccess]);

  useEffect(() => {
  if (createError) {
    toast.error(createError);
  }
}, [createError]);

  const handleChange = (e) => {
     if (e.target.name === "companyLogo") {
        setForm({ ...form, companyLogo: e.target.files[0] }); // file object
    } else {
        setForm({ ...form, [e.target.name]: e.target.value });
    } 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: createJob.typePrefix + "/pending",
    });
    dispatch(
      createJob({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      })
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h2 className={styles.title}>Post New Job</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input className={styles.input} name="title" placeholder="Job Title" onChange={handleChange} required />
            <input className={styles.input} name="company" placeholder="Company Name" onChange={handleChange} required />
            <input className={styles.input} name="companyLogo" type="file" accept="image/*" onChange={handleChange} />
            <input className={styles.input} name="location" placeholder="Location" onChange={handleChange} required />

            <select className={styles.input} name="jobType" onChange={handleChange} required>
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
            </select>

            <select className={styles.input} name="experienceLevel" onChange={handleChange} required>
              <option value="">Experience Level</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>

            <input className={styles.input} name="salary" placeholder="Salary (e.g. 4-6 LPA)" onChange={handleChange} />
            <textarea className={styles.textarea} name="description" placeholder="Job Description" onChange={handleChange} rows={5} required />
            <input className={styles.input} name="skills" placeholder="Skills (comma separated)" onChange={handleChange} />

            <button className={styles.button} type="submit" disabled={createLoading}>
              {createLoading ? "Posting..." : "Post Job"}
            </button>

            
          </form>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}