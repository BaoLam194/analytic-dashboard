import { useContext } from "react";
import { UserContext } from "../../UserContext";
import DataDisplayer from "../../components/DataDisplayer";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";

import person1 from "/oggy.jpg";
import person2 from "/luffy.webp";

const teamMembers = [
  {
    name: "Tran",
    title: "Senior 网路键盘侠",
    img: person1,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt exercitationem laboriosam alias magni, tenetur obcaecati soluta. Culpa error, impedit autem corrupti soluta quo obcaecati, ad, tempore explicabo beatae quasi ut!.",
  },
  {
    name: "Pham",
    title: "Senior troller",
    img: person2,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt exercitationem laboriosam alias magni, tenetur obcaecati soluta. Culpa error, impedit autem corrupti soluta quo obcaecati, ad, tempore explicabo beatae quasi ut!.",
  },
];

export default function Dashboard() {
  const { token, setToken } = useContext(UserContext);

  if (!token) return <div>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
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
      {/* Trooling section */}
      <section className={styles["troll-aboutSection"]} id="about">
        <div className={styles["troll-container"]}>
          <h2>About Us</h2>
          <p>
            We make this area for fun to fill out space, don't care about that
            :D
          </p>
          <div className={styles["troll-cardRow"]}>
            {teamMembers.map((member, idx) => (
              <div className={styles["troll-card"]} key={idx}>
                <div className={styles["troll-imageBox"]}>
                  <img src={member.img} alt={member.name} />
                  <div className={styles["troll-overlay"]}>
                    <a href="#">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-google-plus-g"></i>
                    </a>
                    <a href="#">
                      <i className="fa-brands fa-dribbble"></i>
                    </a>
                  </div>
                </div>
                <div className={styles["troll-infoBox"]}>
                  <h3>{member.name}</h3>
                  <span>{member.title}</span>
                  <p>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
