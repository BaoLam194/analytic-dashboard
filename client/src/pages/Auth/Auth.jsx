import styles from "./Auth.module.css";
import { useParams, Link } from "react-router-dom";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

export default function Auth() {
  const { name } = useParams(); // Get route param

  return (
    <div className={styles.flex}>
      <div
        className={`${styles["bg-white"]} ${styles["text-left"]} ${styles["control-box"]}`}
      >
        <div className={styles["self-center"]}>
          <Link to="/" className={styles.flex}>
            <img src="/vite.svg" alt="Logo" />
            <h1>DataLytics</h1>
          </Link>
        </div>

        {name === "login" ? (
          <>
            <div>
              <h2 className={styles["self-center"]}>Welcome back</h2>
              <p className={styles["self-center"]}>
                Sign in to your account to continue
              </p>
            </div>
            <LogIn />
            <div>
              <p className={styles["self-center"]}>
                Don't have an account?
                <Link to="/auth/signup"> Sign up</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 className={styles["self-center"]}>Create your account</h2>
              <p className={styles["self-center"]}>
                Get started with your data analysis journey
              </p>
            </div>
            <SignUp />
            <div>
              <p className={styles["self-center"]}>
                Already have an account?
                <Link to="/auth/login"> Log in</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
