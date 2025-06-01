import { useState } from "react";
import supabase from "../client";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    //data state
    userName: "",
    email: "",
    password: "",
    conf_password: "",
  });
  const [loading, setLoading] = useState(false); //popupstate
  const [message, setMessage] = useState(""); //popup message
  const navigate = useNavigate(); // navigate to log in
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            userName: formData.userName,
          },
        },
      });
      if (error) throw error;
      setMessage("Sign up successful! Please check your email to confirm.");
    } catch (error) {
      setMessage("Sign up failed: " + error.message);
    } finally {
      setLoading(true);
    }
  }

  return (
    <>
      {loading && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{message}</p>
            <button
              onClick={() => {
                setLoading(false);
                if (message.includes("successful")) {
                  navigate("/auth/login");
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Your username"
          value={formData.userName}
          name="userName"
          onChange={handleChange}
        />
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
        <label htmlFor="password">
          Confirm password
          {formData.password === formData.conf_password ? (
            ""
          ) : (
            <span className="error-text">Please use the same password</span>
          )}
        </label>
        <input
          id="conf_password"
          type="password"
          placeholder="Confirm your password"
          value={formData.conf_password}
          name="conf_password"
          onChange={handleChange}
          className={
            formData.password === formData.conf_password ? "" : "error"
          }
        />
        <button className="btn-auth" type="submit" disabled={loading}>
          Create an account
        </button>
      </form>
    </>
  );
}
