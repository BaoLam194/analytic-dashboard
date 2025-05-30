import "./Home.css";
import { Link } from "react-router-dom";
import Card from "../components/Card";

export default function Home() {
  return (
    <>
      <header>
        <nav>
          <Link to="/" className="icon">
            <img src="/vite.svg"></img>
            <h2>Analytics</h2>
          </Link>
        </nav>
        <div className="auth">
          <Link to="/auth/login">
            <button className="btn btn-white">Log in</button>
          </Link>
          <Link to="/auth/signup">
            <button className="btn btn-black">Sign up</button>
          </Link>
        </div>
      </header>
      <main>
        <section className="headline">
          <h1>
            Transform Your Data Into <span className="highlight">Insights</span>
          </h1>
          <p className="subtext">
            Upload, clean, transform, and visualize your data with our powerful
            analytics platform. Support for CSV and Excel files with advanced
            data manipulation tools.
          </p>
        </section>
        <section className="mainbtn">
          <Link to="/">
            <button className="btn btn-black">Get started now!</button>
          </Link>
          <Link to="/">
            <button className="btn btn-white">View demo</button>
          </Link>
        </section>
        <section className="feature">
          <h1 className="featuretitle">Powerful features</h1>
          <div className="cardcontainer">
            <Card
              source="/vite.svg"
              title="Data Upload"
              description="Upload CSV and Excel files with drag-and-drop support"
            />
            <Card
              source="/vite.svg"
              title="Data Transformation"
              description="Change data types, standardize, and normalize your datasets"
            />
            <Card
              source="/vite.svg"
              title="Visualization"
              description="Create beautiful charts and graphs from your data"
            />
            <Card
              source="/vite.svg"
              title="Dataset Management"
              description="Save and manage multiple versions of your datasets"
            />
            <Card
              source="/vite.svg"
              title="User Authentication"
              description="Secure login and user management system"
            />
            <Card
              source="/vite.svg"
              title="Advanced Analytics"
              description="Statistical analysis and data insights"
            />
          </div>
        </section>
      </main>
      <footer>Copyright@Orbital2025</footer>
    </>
  );
}
