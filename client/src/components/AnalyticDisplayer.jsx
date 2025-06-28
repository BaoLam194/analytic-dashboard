import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import styles from "./AnalyticDisplayer.module.css";
export default function AnalyticBoard() {
  const { file } = useParams(); // current file from the browser url
  const { token } = useContext(UserContext);
  const [modal, setModal] = useState(""); //modal
  const [mode, setMode] = useState(""); //form handling state
  const [options, setOptions] = useState([]);
  const [typeOne, setTypeOne] = useState("");
  const [typeTwo, setTypeTwo] = useState("");
  const [result, setResult] = useState({}); //result from server
  const navigate = useNavigate(); //navigate ? : )
  //check if file
  useEffect(() => {
    if (!file) {
      setModal("Please choose a file");
      return;
    }
  }, [file]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Testing for type");
    console.log(typeOne);
    console.log(typeTwo);
    const formData = new FormData(e.target); // extract data from the form

    const mode = formData.get("mode"); // get selected radio value
    const varone = formData.get("varone");
    const vartwo = formData.get("vartwo");
    const ana_option = formData.getAll("ana_option"); // analysis option
    const visualization =
      formData.get("visual") === "null" ? "" : formData.get("visual");
    const fileName = file;
    if (!mode) {
      alert("Please select a mode.");
      return;
    }
    if (varone === vartwo) {
      alert("Please choose different variables");
      return;
    }
    const payload =
      mode === "bivariate"
        ? { mode, varone, vartwo, ana_option, visualization, fileName }
        : { mode, varone, ana_option, visualization, fileName }; // data transfer

    try {
      const response = await fetch("/api/analytic/submitting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.user.id}`,
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const result = await response.json();
      console.log("Server response:", result);
      setResult(result || {});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch("/api/analytic/showheader", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.user.id}`,
          },
          body: JSON.stringify({ file: file }),
          // file = testing.csv
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Unknown error");
        }
        const data = await res.json();
        if (data.error) {
          setModal("Please check your file path again!");
          throw new Error();
        }
        console.log("receive options successfully");
        console.log(data);
        if (!data)
          throw new Error("There is no columns in your file, check again!");
        const temp = data[0].split(" ")[1];
        setTypeOne(temp);
        // automatically change the typeone to initialize the condition
        setOptions(data || []);
      } catch (error) {
        alert("Encouter some error: " + error.message);
      }
    }

    if (file) fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {/* Modal only  */}
      {modal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>{modal}</p>
            <div className={styles.modalButtons}>
              <button
                onClick={() => {
                  setModal("");
                  navigate("/");
                }}
              >
                Return to file
              </button>
            </div>
          </div>
        </div>
      )}
      <header>
        <nav>
          <Link to="/" className={styles.icon}>
            <img src="/vite.svg" alt="logo" />
            <h2>DataLytics</h2>
          </Link>
        </nav>
        <div className={styles["nav-link"]}>
          {/* <Link to="/" className={styles["nav-child"]}>
            <h3>File system</h3>
          </Link> */}
          {/* <Link to="/analytic" className={styles["nav-child"]}>
            <h3>Analytic</h3>
          </Link> */}
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <p>Variable</p>
          <label>
            <input
              type="radio"
              name="mode"
              value="univariate"
              onChange={() => setMode("univariate")}
            />
            Univariate
          </label>

          <label>
            <input
              type="radio"
              name="mode"
              value="bivariate"
              onChange={() => setMode("bivariate")}
            />
            Bivariate
          </label>
        </div>
        {/* Choose variable */}
        <div>
          {/* Always show the first variable */}

          <select
            name="varone"
            defaultValue={options[1]} // selects the second option by default to trigger the state
            onChange={(e) => setTypeOne(e.target.value.split(" ")[1])}
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt.split(" ")[0] +
                  (opt.split(" ")[1] === "categorical" ? " (abc)" : " (123)")}
              </option>
            ))}
          </select>

          {mode === "bivariate" && (
            <select
              name="vartwo"
              onChange={(e) => setTypeTwo(e.target.value.split(" ")[1])}
            >
              {options.map((opt, idx) => (
                <option
                  key={idx}
                  value={opt}
                  onChange={() => setTypeTwo(opt.split(" ")[1])}
                >
                  {opt.split(" ")[0] +
                    (opt.split(" ")[1] === "categorical" ? " (abc)" : " (123)")}
                </option>
              ))}
            </select>
          )}
        </div>
        {/* Choose analysis options */}
        <div>
          <p>Analysis Options</p>
          <label>
            <input
              type="checkbox"
              name="ana_option"
              value="summary"
              checked
              onChange={() => {
                return false;
              }}
            />
            Summary
          </label>
          {mode === "univariate" && (
            <label>
              <input type="checkbox" name="ana_option" value="range" />
              Range
            </label>
          )}
          {mode === "univariate" && (
            <label>
              <input type="checkbox" name="ana_option" value="variance" />
              Variance
            </label>
          )}
        </div>
        <div>
          <p>Visualization</p>
          <label>
            <input type="radio" name="visual" value="null" />
            None
          </label>
          {mode === "univariate" && typeOne === "numerical" && (
            <label>
              <input type="radio" name="visual" value="hist" />
              Histogram
            </label>
          )}
          {mode === "univariate" && typeOne === "numerical" && (
            <label>
              <input type="radio" name="visual" value="boxplot" />
              Boxplot
            </label>
          )}
          {mode === "univariate" && typeOne === "numerical" && (
            <label>
              <input type="radio" name="visual" value="kde" />
              KDE
            </label>
          )}
          {mode === "univariate" && typeOne === "categorical" && (
            <label>
              <input type="radio" name="visual" value="bar" />
              Bar chart
            </label>
          )}
          {mode === "univariate" && typeOne === "categorical" && (
            <label>
              <input type="radio" name="visual" value="pie" />
              Pie chart
            </label>
          )}
        </div>
        <button type="submit">Analyze</button>
      </form>
      {result.visualization ? (
        <div>
          <img src={result.visualization} alt="graph"></img>
        </div>
      ) : (
        <></>
      )}
      {result.analysis && <div>{result.analysis["50%"]}</div>}
    </>
  );
}
