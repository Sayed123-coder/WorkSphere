"use client";
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./profile.module.css"
import { clientServer } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ProfileShimmer } from '@/components/Shimmer/shimmerEffect';

function ProfilePage() {
    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.post)
    const dispatch = useDispatch();
    const router=useRouter();

    const [userProfile, setUserProfile] = useState({})
    const [userPosts, setUserPosts] = useState([]);

    // Work Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputData, setInputData] = useState({
        company: "",
        position: "",
        years: ""
    });

    // Education Modal — NEW
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const [eduInputData, setEduInputData] = useState({
        school: "",
        degree: "",
        fieldOfStudy: ""
    });

    const [originalData, setOriginalData] = useState(null);

    const handleWorkInputChange = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value })
    }

    // Education input handler — NEW
    const handleEduInputChange = (e) => {
        const { name, value } = e.target;
        setEduInputData({ ...eduInputData, [name]: value });
    }
     
    useEffect(() => {
     if (userProfile?.userId?.name) {
        document.title = `${userProfile.userId.name} | WorkSphere`;
      }
     }, [userProfile]);

    useEffect(() => {
        dispatch(getAboutUser());
        dispatch(getAllPosts())
    }, []);

    useEffect(() => {
        if (authState.user != undefined) {
            setUserProfile(authState.user);
            setOriginalData(authState.user);

            let posts = postState.posts.filter((post) => {
                return post.userId?.username === authState.user?.userId?.username;
            })
            setUserPosts(posts)
        }
    }, [authState.user, postState.posts]);

    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file)
        await clientServer.post("/update_profile_picture", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Profile picture updated! ✅");
        dispatch(getAboutUser())
    }

    const updateCoverImage = async (file) => {
        const formData = new FormData();
        formData.append("coverImage", file);
        await clientServer.post("/update_cover_image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Cover image updated! ✅");
        dispatch(getAboutUser());
    }

    const updateProfileData = async () => {
        await clientServer.post("/user_update", {
            name: userProfile.userId.name,
        });

        await clientServer.post("/update_profile_data", {
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education,
        });

        setOriginalData(userProfile);
        toast.success("Profile updated! ✅");
        dispatch(getAboutUser());
    }

    const hasChanges =
        originalData &&
        JSON.stringify(userProfile) !== JSON.stringify(originalData);

    return (
        <UserLayout>
            <DashboardLayout>
 
                {authState.user && userProfile.userId ?
                    <div className={styles.container}>

                        {/* Header Card */}
                        <div className={styles.profileHeaderCard}>

                            {/* Cover Image */}
                            <div
                                className={styles.backdropContainer}
                                style={{
                                    backgroundImage: userProfile.coverImage
                                        ? `url(${userProfile.coverImage})`
                                        : `url("https://images.pexels.com/photos/2527248/pexels-photo-2527248.jpeg")`
                                }}
                            >
                                {/* Cover Edit Button */}
                                <label htmlFor="coverImageUpload" className={styles.coverEditBtn}>
                                    Edit Cover
                                </label>
                                <input
                                    hidden
                                    type="file"
                                    id="coverImageUpload"
                                    accept="image/*"
                                    onChange={(e) => updateCoverImage(e.target.files[0])}
                                />

                                {/* Profile Picture */}
                                <label htmlFor="profilePictureUpload" className={styles.backdrop_Overlay}>
                                    <p>Edit</p>
                                </label>
                                <input onChange={(e) => updateProfilePicture(e.target.files[0])} hidden type="file" id="profilePictureUpload" />
                                <img src={userProfile.userId.profilePicture} />
                            </div>

                            <div className={styles.postContainer_details}>
                                <div className={styles.mainInfoWrapper}>
                                    <div className={styles.leftInfo}>
                                        <div className={styles.nameSection}>
                                            <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) => {
                                                setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                                            }} />
                                            <p className={styles.usernameText}>@{userProfile.userId.username}</p>
                                        </div>

                                        <div className={styles.bioContainer}>
                                            <textarea
                                                className={styles.bioTextarea}
                                                value={userProfile.bio}
                                                onChange={(e) => {
                                                    setUserProfile({ ...userProfile, bio: e.target.value })
                                                }}
                                                rows={Math.max(3, Math.ceil((userProfile.bio || "").length / 80))}
                                            />
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className={styles.rightActivity}>
                                        <h2 className={styles.activityTitle}>Recent Activity</h2>
                                        {userPosts.slice(0, 3).map((post) => (
                                            <div key={post._id} className={styles.miniPostCard}>
                                                {post.media ?
                                                    <img src={post.media} className={styles.activityImg} alt="post" /> :
                                                    <div className={styles.emptyImg}></div>
                                                }
                                                <p className={styles.miniPostBody}>{post.body.substring(0, 40)}...</p>
                                            </div>
                                        ))}

                                         {userPosts.length > 0 && (
                                            <button
                                             className={styles.viewAllBtn}
                                             onClick={() => router.push(`/view_all_post/${userProfile.userId._id}`)}
                                              >
                                              View All Posts →
                                            </button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience Card */}
                        <div className={styles.sectionCard}>
                            <h4 className={styles.sectionTitle}>Experience</h4>
                            <div className={styles.workHistoryContainer}>
                                {(userProfile.pastWork || []).map((work, index) => (
                                    <div key={index} className={styles.workHistoryCard}>
                                        <p className={styles.workCompany}>
                                            {work.company} — {work.position}
                                        </p>
                                        <p className={styles.workYears}>{work.years}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setIsModalOpen(true)} className={styles.addWorkButton}>+ Add Work</button>
                        </div>

                        {/* Current Position Card */}
                        <div className={styles.sectionCard}>
                            <h4 className={styles.sectionTitle}>Current Position</h4>
                            <textarea
                             className={styles.inputLikeText}
                             placeholder="Enter your current position"
                             value={userProfile.currentPost || ""}
                             rows={2}
                             onChange={(e) =>
                              setUserProfile({ ...userProfile, currentPost: e.target.value })
                               }
                            />
                        </div>

                       {/* Education Card — UPDATED UI */}
                        <div className={styles.sectionCard}>
                        <h4 className={styles.sectionTitle}>Education</h4>
                        <div className={styles.educationContainer}>
                        {(userProfile.education || []).map((edu, index) => (
                        <div key={index} className={styles.educationCardEditable}>
                          <textarea
                             rows={Math.max(1, Math.ceil(edu.school.length / 30))}
                             placeholder="School / College"
                             value={edu.school}
                             onChange={(e) => {
                             const updated = [...userProfile.education];
                             updated[index].school = e.target.value;
                             setUserProfile({ ...userProfile, education: updated });
                            }}
                             className={`${styles.eduInput} ${styles.schoolTitle}`}
                            />
                            <textarea
                             rows={Math.max(1, Math.ceil(edu.degree.length / 30))}
                             placeholder="Degree"
                             value={edu.degree}
                             onChange={(e) => {
                             const updated = [...userProfile.education];
                             updated[index].degree = e.target.value;
                             setUserProfile({ ...userProfile, education: updated });
                             }}
                             className={`${styles.eduInput} ${styles.degreeText}`}
                           />
                           <textarea
                             rows={Math.max(1, Math.ceil(edu.fieldOfStudy.length / 30))}
                             placeholder="Field of Study"
                             value={edu.fieldOfStudy}
                             onChange={(e) => {
                             const updated = [...userProfile.education];
                             updated[index].fieldOfStudy = e.target.value;
                             setUserProfile({ ...userProfile, education: updated });
                              }}
                             className={`${styles.eduInput} ${styles.fieldOfStudyText}`}
                           />
                        </div>
                       ))}
                    </div>
     
                    <button onClick={() => setIsEduModalOpen(true)} className={styles.addWorkButton}>
                    + Add Education
                  </button>
                  </div> 

                    </div>
                    :<ProfileShimmer />
                }

                {/* Floating Save Button */}
                {hasChanges && (
                    <div className={styles.floatingSaveBar}>
                        <button
                            onClick={updateProfileData}
                            className={styles.floatingSaveBtn}
                        >
                            Save Profile Changes
                        </button>
                    </div>
                )}

                {/* Work Modal */}
                {isModalOpen &&
                    <div onClick={() => setIsModalOpen(false)} className={styles.commentsContainer}>
                        <div onClick={(e) => e.stopPropagation()} className={styles.allCommentsContainer}>
                            <h3 className={styles.modalTitle}>Add Work Experience</h3>
                            <input onChange={handleWorkInputChange} className={styles.inputField} type="text" placeholder="Enter Company" name='company' />
                            <input onChange={handleWorkInputChange} className={styles.inputField} type="text" placeholder="Enter Position" name='position' />
                            <input onChange={handleWorkInputChange} className={styles.inputField} type="text" placeholder="Years (e.g. 2020-2023)" name='years' />
                            <div onClick={() => {
                                setUserProfile({ ...userProfile, pastWork: [...(userProfile.pastWork || []), inputData] })
                                setInputData({ company: "", position: "", years: "" });
                                setIsModalOpen(false);
                            }} className={styles.updateProfileBtn}>Add Work</div>
                        </div>
                    </div>
                }

                {/* Education Modal — NEW */}
                {isEduModalOpen &&
                    <div onClick={() => setIsEduModalOpen(false)} className={styles.commentsContainer}>
                        <div onClick={(e) => e.stopPropagation()} className={styles.allCommentsContainer}>
                            <h3 className={styles.modalTitle}>Add Education</h3>
                            <input
                                onChange={handleEduInputChange}
                                className={styles.inputField}
                                type="text"
                                placeholder="School / College"
                                name="school"
                            />
                            <input
                                onChange={handleEduInputChange}
                                className={styles.inputField}
                                type="text"
                                placeholder="Degree (e.g. B.Tech, B.Sc)"
                                name="degree"
                            />
                            <input
                                onChange={handleEduInputChange}
                                className={styles.inputField}
                                type="text"
                                placeholder="Field of Study (e.g. Computer Science)"
                                name="fieldOfStudy"
                            />
                            <div
                                onClick={() => {
                                    setUserProfile({
                                        ...userProfile,
                                        education: [...(userProfile.education || []), eduInputData]
                                    });
                                    setEduInputData({ school: "", degree: "", fieldOfStudy: "" });
                                    setIsEduModalOpen(false);
                                }}
                                className={styles.updateProfileBtn}
                            >
                                Add Education
                            </div>
                        </div>
                    </div>
                }

            </DashboardLayout>
        </UserLayout>
    )
}

export default ProfilePage;