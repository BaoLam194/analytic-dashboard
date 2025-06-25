import styles from "./Auth.module.css";
import { useState, useContext } from "react";
import supabase from "../../client";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function LogIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); //popupstate
  const [message, setMessage] = useState(""); //popup message
  const navigate = useNavigate(); // navigate to log in
  const { setToken } = useContext(UserContext); // to set the login token
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      setMessage("Log in successful! Redirecting...");
      setLoading(true);
      setToken(data);
      localStorage.setItem("token", JSON.stringify(data)); // Save token in localStorage
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      setMessage("Log in failed: " + error.message);
      console.log("error:", error);
      setLoading(true);
    }
  }

  return (
    <>
      {loading && (
        <div className={styles["popup-overlay"]}>
          <div className={styles.popup}>
            <p>{message}</p>
            <button
              className={styles["btn-special"]}
              onClick={() => {
                setLoading(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.authform}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          placeholder="Your email"
          value={formData.email}
          name="email"
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          value={formData.password}
          name="password"
          onChange={handleChange}
        />
        <button className={styles["btn-auth"]} type="submit">
          Log in
        </button>
      </form>
    </>
  );
}
