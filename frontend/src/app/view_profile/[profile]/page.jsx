"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getConnectionsRequest,
  getMyConnectionRequest,
  getProfileByUsername,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./profile.module.css";
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function ViewProfile() {
  const { profile: username } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { viewedProfile, connections, connectionRequest } =
    useSelector((s) => s.auth);
  const { posts } = useSelector((s) => s.post);

  const [userPosts, setUserPosts] = useState([]);

  // 🔹 Initial data load
  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getConnectionsRequest());
    dispatch(getMyConnectionRequest());
  }, []);

  // 🔹 Load profile by username
  useEffect(() => {
    if (username) dispatch(getProfileByUsername(username));
  }, [username]);

  // 🔹 Filter posts of this user (no extra API calls)
  useEffect(() => {
    const filtered = posts.filter(
      (p) => p.userId?.username === username
    );
    setUserPosts(filtered);
  }, [posts, username]);

  // 🔹 Compute connection state (no local booleans)
  const connectionStatus = useMemo(() => {
    if (!viewedProfile) return "none";

    const id = viewedProfile.userId._id;

    const sent = connections.find((c) => c.connectionId._id === id);
    if (sent) return sent.status ? "connected" : "pending";

    const received = connectionRequest.find((c) => c.userId._id === id);
    if (received) return received.status ? "connected" : "pending";

    return "none";
  }, [viewedProfile, connections, connectionRequest]);

  if (!viewedProfile || !viewedProfile.userId) return null;

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          
          {/* Cover */}
          <div className={styles.backdropContainer}></div>

          <div className={styles.profilePhotoWrapper}>
           <img src={viewedProfile.userId.profilePicture} />
          </div>

          <div className={styles.postContainer_details}>
            <div className={styles.postContainer_flex}>

              {/* Left */}
              <div style={{ flex: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <h2>{viewedProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{viewedProfile.userId.username}
                  </p>
                </div>

                {/* Connection Button */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  {connectionStatus === "none" && (
                    <button
                      onClick={async () => {
                        await dispatch(
                          sendConnectionRequest({
                            connectionId: viewedProfile.userId._id,
                          })
                        );
                        dispatch(getConnectionsRequest());
                      }}
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}

                  {connectionStatus === "pending" && (
                    <button className={styles.connectedButton}>
                      Pending
                    </button>
                  )}

                  {connectionStatus === "connected" && (
                    <button className={styles.connectedButton}>
                      Connected
                    </button>
                  )}

                  {/* Resume Download */}
                  <div
                    onClick={async () => {
                      const res = await clientServer.get(
                        `/user/download_resume?id=${viewedProfile.userId._id}`
                      );
                      window.open(`${BASE_URL}/${res.data.message}`, "_blank");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    ⬇ Resume
                  </div>
                </div>

                <p style={{ marginTop: "1rem" }}>
                  {viewedProfile.bio}
                </p>

                {/* Recent Activity */}
              <div style={{ marginTop: "2rem"}} >
                <h3>Recent Activity</h3>
                {userPosts.map((post) => (
                  <div key={post._id} className={styles.card_profileContainer}>
                    {post.media && (
                      <img src={post.media} />
                    )}
                    <p>{post.body}</p>
                  </div>
                ))}
              </div>
              </div>

              
            </div>
          </div>

          {/* Work History */}
          <div className="work_history">
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {(viewedProfile.pastWork || []).map((work, i) => (
                <div key={i} className={styles.workHistoryCard}>
                  <p style={{ fontWeight: "bold" }}>
                    {work.company} - {work.position}
                  </p>
                  <p>{work.years}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}