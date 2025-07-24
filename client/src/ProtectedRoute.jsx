import { useContext } from "react";
import { UserContext } from "./UserContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Main/Dashboard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function RedirectedProtectedNoRoute({ children }) {
  //redirect if access token-required with no token
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      console.log("I am activating");
      navigate("/"); // redirect to home if no token
    }
  }, [token, navigate]);

  if (!token) return null; // prevent rendering while redirecting
  return children || <Dashboard />;
}

function RedirectedProtectedRoute({ children }) {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      console.log("Fk yeah");
      navigate("/"); // redirect to dashboard if no token
    }
  }, [token, navigate]);

  if (token) return null; // redirecting
  //there is token
  return children || <Home />;
}
function SafeRoute() {
  const { token } = useContext(UserContext);
  return token ? <Dashboard /> : <Home />;
}
export { RedirectedProtectedNoRoute, RedirectedProtectedRoute, SafeRoute };
