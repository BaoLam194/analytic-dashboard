import { useContext } from "react";
import { UserContext } from "../../UserContext";
import DataDisplayer from "../../components/DataDisplayer";
import AnalyticBoard from "../../components/AnalyticDisplayer";

import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { token, setToken } = useContext(UserContext);

  if (!token) return <div>Loading...</div>;

  return (
    <>
      <header>
        <nav>
          <Link to="/" className={styles.icon}>
            <img src="/vite.svg" alt="logo" />
            <h2>DataLytics</h2>
          </Link>
        </nav>
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
      <AnalyticBoard />
    </>
  );
}
