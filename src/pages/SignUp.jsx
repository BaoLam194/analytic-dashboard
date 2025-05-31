import { useState } from "react";

export default function SignUp() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    conf_password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        placeholder="Your username"
        value={data.username}
        name="username"
        onChange={handleChange}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="text"
        placeholder="Your email"
        value={data.email}
        name="email"
        onChange={handleChange}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Your password"
        value={data.password}
        name="password"
        onChange={handleChange}
      />
      <label htmlFor="password">Confirm password</label>
      <input
        id="conf_password"
        type="password"
        placeholder="Confirm your password"
        value={data.password}
        name="conf_password"
        onChange={handleChange}
      />
      <button className="btn-auth" type="submit">
        Create an account
      </button>
    </form>
  );
}
