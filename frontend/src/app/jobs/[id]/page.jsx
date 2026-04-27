"use client";

import styles from "./jobDetails.module.css";
import { applyToJob } from "@/config/redux/action/applicationAction";
import { getJobById } from "@/config/redux/action/jobAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function JobDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentJob } = useSelector((state) => state.job);
  const { loading, success } = useSelector((state) => state.application);

  const [form, setForm] = useState({
     name: "",
     email: "",
     phone: "",
     coverLetter: "",
     resume: null,
  });

  useEffect(() => {
    dispatch(getJobById(id));
  }, [id]);

  useEffect(() => {
  if (currentJob?.title) {
    document.title = `${currentJob.title} | WorkSphere`;
  }
}, [currentJob]);

  useEffect(()=>{
    if(success){
      toast.success("Application Submitted Successfully! 🎉");
    }
  },[success]);


  const handleChange = (e) => {
  if (e.target.name === "resume") {
    setForm({ ...form, resume: e.target.files[0] });
  } else {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
};


  const handleApply = () => {
  const formData = new FormData();
  formData.append("jobId", id);
  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("phone", form.phone);
  formData.append("coverLetter", form.coverLetter);
  formData.append("resume", form.resume);

  dispatch(applyToJob(formData));

  setForm({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });
};

  if (!currentJob) return <p>Loading...</p>;

  return (
    <UserLayout>
      <DashboardLayout>
       <div className={styles.wrapper}>
  <div className={styles.card}>
    
    <div className={styles.header}>
      <img
        src={currentJob.companyLogo}
        alt="logo"
        className={styles.logo}
      />

      <div>
        <div className={styles.title}>{currentJob.title}</div>
        <div className={styles.company}>{currentJob.company}</div>
        <div className={styles.metaRow}>
          {currentJob.location} • {currentJob.salary}
        </div>

        <div className={styles.badges}>
          {currentJob.jobType && (
            <span className={styles.badge}>{currentJob.jobType}</span>
          )}
          {currentJob.experienceLevel && (
            <span className={styles.badge}>
              {currentJob.experienceLevel}
            </span>
          )}
        </div>
      </div>
    </div>

    {currentJob.skills?.length > 0 && (
      <div className={styles.skills}>
        {currentJob.skills.map((skill, i) => (
          <span key={i} className={styles.skill}>
            {skill}
          </span>
        ))}
      </div>
    )}

    <div className={styles.description}>
      {currentJob.description}
    </div>

    <div className={styles.applyBox}>
      <h4 className={styles.heading}>Apply for this job</h4>

      <input
         className={styles.input}
         name="name"
         placeholder="Full Name"
         value={form.name}
         onChange={handleChange}
       />
      <input
        className={styles.input}
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
       onChange={handleChange}
      />
      <input
        className={styles.input}
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
      />

      <textarea
        className={styles.textarea}
        placeholder="Write cover letter..."
        name="coverLetter"
        value={form.coverLetter}
        onChange={handleChange}
      />

        {/* ✅ Resume upload */}
       <label className={styles.label}>Upload Resume (PDF)</label>
       <input
         className={styles.input}
         name="resume"
         type="file"
         accept=".pdf"
         onChange={handleChange}
       />

      <button
        className={styles.button}
        onClick={handleApply}
        disabled={loading}
      >
        {loading ? "Applying..." : "Apply"}
      </button>

      
    </div>
  </div>
</div>
      </DashboardLayout>
    </UserLayout>
  );
}