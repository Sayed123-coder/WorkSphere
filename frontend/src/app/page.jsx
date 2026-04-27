"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { Poppins } from "next/font/google";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "600"],
});

export default function Home() {
  const router = useRouter();

    useEffect(() => {
     document.title = "WorkSphere | Professional Networking";
     }, []);
  const handleJoinClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <UserLayout>
      <div className={`${poppins.className}`}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Build Professional Connections That Matter</p>
            <p>
              A clean, distraction-free network to showcase work, connect, and grow..
            </p>

            <div onClick={handleJoinClick} className={`${styles.buttonJoin} ctaPrimary`}>
              <p>Join Now</p>
            </div>
          </div>

          <div className={styles.mainContainer_right}>
            <Image
              src="/images/newconnections.jpg"
              width={500}
              height={400}
              alt="Connections"
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}