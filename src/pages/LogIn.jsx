import { useState } from "react";

export default function LogIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <form>
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
      <button className="btn-auth" type="submit">
        Log in
      </button>
    </form>
  );
}
