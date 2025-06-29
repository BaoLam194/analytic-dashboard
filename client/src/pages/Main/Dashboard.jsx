import { useContext } from "react";
import { UserContext } from "../../UserContext";
import DataDisplayer from "../../components/DataDisplayer";

import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { token, setToken } = useContext(UserContext);

  if (!token) return <div>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <header>
        <nav>
          <Link to="/" className={styles.icon}>
            <img src="/vite.svg" alt="logo" />
            <h2>DataLytics</h2>
          </Link>
        </nav>
        <div className={styles["nav-link"]}>
          {/* <Link to="/" className={styles["nav-child"]}>
            <h3>File system</h3>
          </Link> */}
          <Link to="/analytic" className={styles["nav-child"]}>
            <h3>Analytic</h3>
          </Link>
        </div>
        <div className={styles.auth}>
          <span className={`${styles.welcome}`}>
            {token?.user?.user_metadata?.userName}
          </span>
          <button
            className={`${styles.btn} ${styles["btn-black"]}`}
            onClick={() => {
              setToken(null);
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <DataDisplayer />
    </div>
  );
}
