import styles from "./shimmer.module.css";

export function PostShimmer() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.circle} ${styles.shine}`}></div>
        <div className={styles.lines}>
          <div className={`${styles.line} ${styles.shine}`}></div>
          <div className={`${styles.lineShort} ${styles.shine}`}></div>
        </div>
      </div>
      <div className={`${styles.block} ${styles.shine}`}></div>
      <div className={`${styles.image} ${styles.shine}`}></div>
    </div>
  );
}

export function JobShimmer() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.square} ${styles.shine}`}></div>
        <div className={styles.lines}>
          <div className={`${styles.line} ${styles.shine}`}></div>
          <div className={`${styles.lineShort} ${styles.shine}`}></div>
          <div className={`${styles.lineShorter} ${styles.shine}`}></div>
        </div>
      </div>
      <div className={styles.skillsRow}>
        <div className={`${styles.pill} ${styles.shine}`}></div>
        <div className={`${styles.pill} ${styles.shine}`}></div>
        <div className={`${styles.pill} ${styles.shine}`}></div>
      </div>
      <div className={`${styles.button} ${styles.shine}`}></div>
    </div>
  );
}

export function ProfileShimmer() {
  return (
    <div className={styles.card}>
      <div className={`${styles.coverImage} ${styles.shine}`}></div>
      <div className={styles.profileInfo}>
        <div className={`${styles.avatar} ${styles.shine}`}></div>
        <div className={styles.lines} style={{marginTop: "80px"}}>
          <div className={`${styles.line} ${styles.shine}`}></div>
          <div className={`${styles.lineShort} ${styles.shine}`}></div>
          <div className={`${styles.block} ${styles.shine}`}></div>
        </div>
      </div>
    </div>
  );
}

export function ConnectionsShimmer() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.circle} ${styles.shine}`}></div>

        <div className={styles.lines}>
          <div className={`${styles.line} ${styles.shine}`}></div>
          <div className={`${styles.lineShort} ${styles.shine}`}></div>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <div className={`${styles.button} ${styles.shine}`}></div>
        </div>
      </div>
    </div>
  );
}

export function DiscoverUserShimmer() {
  return (
    <div className={styles.card}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className={`${styles.circle} ${styles.shine}`}></div>

        <div className={styles.lines}>
          <div className={`${styles.line} ${styles.shine}`}></div>
          <div className={`${styles.lineShort} ${styles.shine}`}></div>
          <div className={`${styles.lineShorter} ${styles.shine}`}></div>
        </div>
      </div>

      <div style={{ marginTop: "14px" }}>
        <div className={`${styles.block} ${styles.shine}`}></div>
        <div className={`${styles.block} ${styles.shine}`}></div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <div className={`${styles.button} ${styles.shine}`}></div>
      </div>
    </div>
  );
}