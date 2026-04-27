"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";
import { incrementLike, deletePost } from "@/config/redux/action/postAction";
import { toast } from "react-toastify";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./viewposts.module.css";

function ViewAllPostsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerInfo, setOwnerInfo] = useState(null);

  const fetchUserPosts = async () => {
    try {
      const res = await clientServer.get(`/get_user_posts/${id}`);
      setPosts(res.data.posts);
      if (res.data.posts.length > 0) {
        setOwnerInfo(res.data.posts[0].userId); // pehli post se user info le lo
      }
    } catch (err) {
      toast.error("Posts load nahi hue!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUserPosts();
  }, [id]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>

          {/* Header */}
          <div className={styles.pageHeader}>
            <button className={styles.backBtn} onClick={() => router.back()}>
              ← Back
            </button>
            {ownerInfo && (
              <div className={styles.ownerInfo}>
                <img
                  src={ownerInfo.profilePicture}
                  className={styles.ownerAvatar}
                  alt=""
                />
                <div>
                  <h2 className={styles.ownerName}>{ownerInfo.name}</h2>
                  <p className={styles.ownerUsername}>@{ownerInfo.username}</p>
                </div>
              </div>
            )}
            <p className={styles.postCount}>{posts.length} Posts</p>
          </div>

          {/* Posts */}
          {loading ? (
            <p className={styles.loadingText}>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className={styles.emptyText}>Koi post nahi mili 😕</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className={styles.postCard}>

                <div className={styles.postHeader}>
                  <img
                    src={post.userId?.profilePicture}
                    className={styles.avatarSmall}
                    alt=""
                  />
                  <div className={styles.userMeta}>
                    <h4>{post.userId?.name}</h4>
                    <span>@{post.userId?.username}</span>
                  </div>

                  {/* Delete button sirf apni posts pe */}
                  {post.userId?._id === authState.user?.userId?._id && (
                    <button
                      className={styles.deleteBtn}
                      onClick={async () => {
                        await dispatch(deletePost(post._id));
                        toast.success("Post deleted!");
                        fetchUserPosts(); // refresh
                      }}
                    >
                      <svg style={{ height: "1em", color: "red" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>

                <p className={styles.postText}>{post.body}</p>

                {post.media && (
                  <div className={styles.imageContainer}>
                    <img src={post.media} className={styles.postImage} alt="post" />
                  </div>
                )}

                <div className={styles.postFooter}>
                  <button
                    className={styles.footerBtn}
                    onClick={async () => {
                      await dispatch(incrementLike(post._id));
                      fetchUserPosts(); // refresh likes
                    }}
                  >
                    👍 {post.likes.length > 0 ? post.likes.length : ""} Like
                  </button>
                  <button
                    className={styles.footerBtn}
                    onClick={() => {
                      const text = encodeURIComponent(post.body);
                      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
                    }}
                  >
                    🔗 Share
                  </button>
                </div>

              </div>
            ))
          )}

        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default ViewAllPostsPage;