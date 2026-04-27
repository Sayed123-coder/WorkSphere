"use client";

import {
  acceptConnection,
  getConnectionsRequest,
  getMyConnectionRequest,
  removeConnection,
} from "@/config/redux/action/authAction";

import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./myConnection.module.css";
import { BASE_URL } from "@/config";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    connectionRequest = [],
    connections = [],
    user,
  } = useSelector((state) => state.auth);

  const currentUserId = user?.userId?._id;

  useEffect(() => {
    dispatch(getMyConnectionRequest());
    dispatch(getConnectionsRequest());
  }, [dispatch]);

  // =========================
  // RECEIVED REQUESTS
  // =========================
  const receivedPending = connectionRequest.filter(
    (c) => c.status === null
  );

  const receivedAccepted = connectionRequest.filter(
    (c) => c.status === true
  );

  // =========================
  // SENT REQUESTS
  // =========================
  const sentPending = connections.filter(
    (c) => c.status === null
  );

  const sentAccepted = connections.filter(
    (c) => c.status === true
  );

  // =========================
  // CONNECTED USERS (FIXED LOGIC)
  // =========================
  const connectedUsers = [...receivedAccepted, ...sentAccepted]
  .map((c) => {
    const isMeSender = c.userId?._id === currentUserId;
    const otherUser = isMeSender ? c.connectionId : c.userId;

    if (!otherUser || otherUser._id === currentUserId) return null;

    return otherUser;
  })
  .filter(Boolean);

  return (
    <UserLayout>
      <DashboardLayout>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          {/* ================= RECEIVED ================= */}
          <h4 className={styles.sectionTitle}>Requests You Received</h4>

          {receivedPending.length === 0 && (
            <h2 className={styles.emptyText}>No incoming requests</h2>
          )}

          {receivedPending.map((req) => {
            const user = req.userId;

            return (
              <div
                key={req._id}
                onClick={() =>
                  router.push(`/view_profile/${user.username}`)
                }
                className={styles.userCard}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>

                  <div className={styles.profilePicture}>
                    <img src={user.profilePicture} />
                  </div>

                  <div className={styles.userInfo}>
                    <h3>{user.name}</h3>
                    <p>@{user.username}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        acceptConnection({
                          requestId: req._id,
                          action_type: "accept",
                        })
                      );
                    }}
                    className={styles.connectedButton}
                  >
                    Accept
                  </button>

                </div>
              </div>
            );
          })}

          {/* ================= SENT ================= */}
          <h4 className={styles.sectionTitle}>Requests You Sent</h4>

          {sentPending.length === 0 && (
            <h2 className={styles.emptyText}>No sent pending requests</h2>
          )}

          {sentPending.map((req) => {
            const user = req.connectionId;

            return (
              <div
                key={req._id}
                onClick={() =>
                  router.push(`/view_profile/${user.username}`)
                }
                className={styles.userCard}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>

                  <div className={styles.profilePicture}>
                    <img src={user.profilePicture} />
                  </div>

                  <div className={styles.userInfo}>
                    <h3>{user.name}</h3>
                    <p>@{user.username}</p>
                  </div>

                  <button className={styles.connectedButton}>
                    Pending
                  </button>

                </div>
              </div>
            );
          })}

          {/* ================= CONNECTED ================= */}
          <h4 className={styles.sectionTitle}>Connected Users</h4>

          {connectedUsers.length === 0 && (
            <h2 className={styles.emptyText}>No connections yet</h2>
          )}

         {connectedUsers.map((user) => {
          if (!user || user._id === currentUserId) return null;

          return (
         <div
          key={user._id}
          onClick={() =>
          router.push(`/view_profile/${user.username}`)
          }
           className={styles.userCard}
          >
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>

          <div className={styles.profilePicture}>
            <img src={user.profilePicture} />
          </div>

         <div className={styles.userInfo}>
           <h3>{user.name}</h3>
           <p>@{user.username}</p>
         </div>

        {/* ✅ REMOVE BUTTON */}
        <button
          onClick={(e) => {
            console.log("REMOVE CLICKED", user._id);
            e.stopPropagation();
            dispatch(removeConnection(user._id));
          }}
          className={styles.removeButton}
        >
          Remove
        </button>

      </div>
    </div>
  );
})}

        </div>

      </DashboardLayout>
    </UserLayout>
  );
}