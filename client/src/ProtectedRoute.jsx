import { useContext } from "react";
import { UserContext } from "./UserContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Main/Dashboard";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(UserContext);

  if (!token) {
    return <Home />; // no token go to home
  }
  //there is token
  return children || <Home />;
}
