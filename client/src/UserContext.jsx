import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext({
  // create context if we want to save more later
  token: null,
  setToken: () => {},
});

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const localToken = localStorage.getItem("token");
    try {
      return localToken ? JSON.parse(localToken) : null;
    } catch {
      return null;
    }
  }); // if there is localtoken, take it

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  //keep localToken in synnc with token
  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
