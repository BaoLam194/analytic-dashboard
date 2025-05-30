import "./Auth.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

export default function Auth() {
  const { name } = useParams(); //router access

  return (
    <div className="flex">
      <div className="bg-white text-left control-box">
        <div className="self-center">
          <Link to="/" className="flex">
            <img src="/vite.svg"></img>
            <h1>DataLytics</h1>
          </Link>
        </div>
        {name === "login" ? (
          <>
            <div>
              <h2 className="self-center">Welcome back</h2>
              <p className="self-center">Sign in to your account to continue</p>
            </div>
            <LogIn />
            <div>
              <p className="self-center">
                Don't have an account?
                <Link to="/auth/login"> Sign up</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 className="self-center">Create your account</h2>
              <p className="self-center">
                Get started with your data analysis journey
              </p>
            </div>
            <SignUp />
            <div>
              <p className="self-center">
                Already have an account?
                <Link to="/auth/login"> Log in</Link>
              </p>
            </div>
          </>
        )}
        <button className="btn">
          {name === "login" ? "Log in" : "Create account"}
        </button>
      </div>
    </div>
  );
}
