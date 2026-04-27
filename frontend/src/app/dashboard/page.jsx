"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
  createComment,
  createPosts,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementLike
} from '@/config/redux/action/postAction';

import {
  getAboutUser,
  getAllUsers,
} from '@/config/redux/action/authAction';

import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import styles from "./page.module.css"
import { BASE_URL } from '@/config';
import { resetPostId } from '@/config/redux/reducer/postReducer';
import { toast } from "react-toastify";
import { PostShimmer } from '@/components/Shimmer/shimmerEffect';

export default function DashBoardComponent() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser());
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere, authState.all_profiles_fetched]);

  const handleUpload = async () => {
    await dispatch(createPosts({
      file: fileContent,
      body: postContent
    }));
    toast.success("Post created! 🎉");
    setPostContent("");
    setFileContent(null);
    dispatch(getAllPosts());
  }

  if (!authState.profileFetched || !authState.user?.userId) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.loader}>
            <PostShimmer />
            <PostShimmer />
            <PostShimmer />
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.feedWrapper}>

          {/* CREATE POST CARD */}
          <div className={styles.createPostCard}>
            <div className={styles.inputArea}>
              <img
                className={styles.avatar}
                src={authState.user?.userId?.profilePicture}
                alt="profile"
              />
              <textarea
                className={styles.textArea}
                placeholder="Start a post..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>

            <div className={styles.createPostActions}>
              <label htmlFor="fileUpload" className={styles.actionItem}>
                <span className={styles.icon}>🖼️</span> Photo
              </label>
              <input
                type="file"
                hidden
                id="fileUpload"
                onChange={(e) => setFileContent(e.target.files[0])}
              />
              
              <button 
                className={styles.postBtn} 
                onClick={handleUpload}
                disabled={!postContent.trim() && !fileContent}
              >
                Post
              </button>
            </div>
          </div>

          {/* POSTS LIST */}
          {postState.posts?.map((post) => (
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
                {post.userId?._id === authState.user?.userId?._id && (
                  <button
                    className={styles.deleteBtn}
                    onClick={async () => {
                      await dispatch(deletePost(post._id));
                       toast.success("Post deleted!");
                      dispatch(getAllPosts());
                    }}
                  >
                    <svg style={{height:"1em",color:"red"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> </svg>
                  </button>
                )}
              </div>

              <p className={styles.postText}>{post.body}</p>

              {post.media && (
                <div className={styles.imageContainer}>
                  <img
                    src={post.media}
                    className={styles.postImage}
                    alt="post content"
                  />
                </div>
              )}

              <div className={styles.postFooter}>
                <button 
                  className={styles.footerBtn}
                  onClick={async () => {
                    await dispatch(incrementLike(post._id));
                    dispatch(getAllPosts());
                  }}
                >
                  👍 {post.likes.length > 0 ? post.likes.length : ''} Like
                </button>

                <button 
                  className={styles.footerBtn}
                  onClick={() => dispatch(getAllComments({ post_id: post._id }))}
                >
                  💬 Comment
                </button>

                <button 
                  className={styles.footerBtn}
                  onClick={() => {
                    const text = encodeURIComponent(post.body);
                    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
                  }}
                >
                  🔗 Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COMMENTS MODAL */}
        {postState.postId !== "" && (
          <div className={styles.overlay} onClick={() => dispatch(resetPostId())}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Comments</h3>
                <button onClick={() => dispatch(resetPostId())} className={styles.closeModal}>✕</button>
              </div>

              <div className={styles.commentsList}>
                {postState.comments.length === 0 ? (
                  <p className={styles.noComments}>No comments yet. Be the first!</p>
                ) : (
                  postState.comments.map((c, i) => (
                    <div key={i} className={styles.commentItem}>
                      <img src={c.userId.profilePicture} alt="" />
                      <div className={styles.commentContent}>
                        <b>{c.userId.name}</b>
                        <p>{c.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.commentInputRow}>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button
                  disabled={!commentText.trim()}
                  onClick={async () => {
                    await dispatch(createComment({
                      postId: postState.postId,
                      body: commentText
                    }));
                    dispatch(getAllComments({ post_id: postState.postId }));
                    setCommentText("");
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  ) 
}