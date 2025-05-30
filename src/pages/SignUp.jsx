import { useState } from "react";

export default function SignUp() {
  const [data, setData] = useState({
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
    <form onSubmit="">
      <label for="email">Email</label>
      <input
        id="email"
        type="text"
        placeholder="Your email"
        value={data.email}
        name="email"
        onChange={handleChange}
      />

      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Your password"
        value={data.password}
        name="password"
        onChange={handleChange}
      />
      <label for="password">Confirm password</label>
      <input
        id="conf_password"
        type="password"
        placeholder="Confirm your password"
        value={data.password}
        name="conf_password"
        onChange={handleChange}
      />
    </form>
  );
}
