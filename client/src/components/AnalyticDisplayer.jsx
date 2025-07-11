import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import styles from "./AnalyticDisplayer.module.css";

const API_URL = import.meta.env.VITE_API_URL;
export default function AnalyticBoard() {
  const { file } = useParams(); // current file from the browser url
  const { token } = useContext(UserContext);
  const [modal, setModal] = useState(""); //modal
  const [mode, setMode] = useState(""); //form handling state
  const [options, setOptions] = useState([]);
  const [typeOne, setTypeOne] = useState("");
  const [typeTwo, setTypeTwo] = useState("");
  const [typeDefault, setTypeDefault] = useState("");
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
      const response = await fetch(`${API_URL}/analytic/submitting`, {
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
        const res = await fetch(`${API_URL}/analytic/showheader`, {
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
        setTypeDefault(temp);
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
    <div className={styles.wrapper}>
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
      <Link to="/">
        <button className={styles.randomButton}>Choose another file</button>
      </Link>
      <div className={styles.analysisContainer}>
        <div className={styles.flexLayout}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formGroup}>
              <p>Variable</p>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="mode"
                  value="univariate"
                  onChange={() => {
                    setMode("univariate");
                    setTypeTwo("");
                  }}
                />
                Univariate
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="mode"
                  value="bivariate"
                  onChange={() => {
                    setMode("bivariate");
                    setTypeTwo(typeDefault);
                  }}
                />
                Bivariate
              </label>
            </div>
            {/* Choose variable */}
            <div className={styles.formGroup}>
              {/* Always show the first variable */}
              <select
                className={styles.selectInput}
                name="varone"
                defaultValue={options[0]} // selects the second option by default to trigger the state
                onChange={(e) => setTypeOne(e.target.value.split(" ")[1])}
              >
                {options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt.split(" ")[0] +
                      (opt.split(" ")[1] === "categorical"
                        ? " (abc)"
                        : " (123)")}
                  </option>
                ))}
              </select>
              {mode === "bivariate" && (
                <select
                  className={styles.selectInput}
                  name="vartwo"
                  defaultValue={options[0]} // selects the second option by default to trigger the state
                  onChange={(e) => setTypeTwo(e.target.value.split(" ")[1])}
                >
                  {options.map((opt, idx) => (
                    <option
                      key={idx}
                      value={opt}
                      onChange={() => setTypeTwo(opt.split(" ")[1])}
                    >
                      {opt.split(" ")[0] +
                        (opt.split(" ")[1] === "categorical"
                          ? " (abc)"
                          : " (123)")}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {/* Choose analysis options */}
            <div className={styles.formGroup}>
              <p>Analysis Options</p>
              <label className={styles.checkboxLabel}>
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
              {typeOne === "numerical" && (
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="ana_option" value="range" />
                  Range
                </label>
              )}
              {typeOne === "numerical" && (
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="ana_option" value="variance" />
                  Variance
                </label>
              )}
            </div>
            <div className={styles.formGroup}>
              <p>Visualization</p>
              <label className={styles.radioLabel}>
                <input type="radio" name="visual" value="null" />
                None
              </label>
              {mode === "univariate" && typeOne === "numerical" && (
                <label className={styles.radioLabel}>
                  <input type="radio" name="visual" value="hist" />
                  Histogram
                </label>
              )}
              {mode === "univariate" && typeOne === "numerical" && (
                <label className={styles.radioLabel}>
                  <input type="radio" name="visual" value="boxplot" />
                  Boxplot
                </label>
              )}
              {mode === "univariate" && typeOne === "numerical" && (
                <label className={styles.radioLabel}>
                  <input type="radio" name="visual" value="kde" />
                  KDE
                </label>
              )}
              {mode === "univariate" && typeOne === "numerical" && (
                <label className={styles.radioLabel}>
                  <input type="radio" name="visual" value="histkde" />
                  Histogram + KDE
                </label>
              )}
              {mode === "univariate" && typeOne === "categorical" && (
                <label className={styles.radioLabel}>
                  <input type="radio" name="visual" value="bar" />
                  Bar chart
                </label>
              )}
              {mode === "univariate" && typeOne === "categorical" && (
                <label className={styles.radioLabel}>
                  <input type="radio" name="visual" value="pie" />
                  Pie chart
                </label>
              )}
              {mode === "bivariate" &&
                typeOne === "numerical" &&
                typeTwo === "numerical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="scatter" />
                    Scatter
                  </label>
                )}
              {mode === "bivariate" &&
                typeOne === "numerical" &&
                typeTwo === "numerical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="hexbin" />
                    Hexbin
                  </label>
                )}
              {mode === "bivariate" &&
                typeOne === "numerical" &&
                typeTwo === "categorical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="boxplot" />
                    Boxplot
                  </label>
                )}
              {mode === "bivariate" &&
                typeOne === "categorical" &&
                typeTwo === "numerical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="boxplot" />
                    Boxplot
                  </label>
                )}
              {mode === "bivariate" &&
                typeOne === "categorical" &&
                typeTwo === "numerical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="violin" />
                    Violin plot
                  </label>
                )}
              {mode === "bivariate" &&
                typeOne === "categorical" &&
                typeTwo === "numerical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="bar" />
                    Bar plot
                  </label>
                )}
              {mode === "bivariate" &&
                typeOne === "categorical" &&
                typeTwo === "numerical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="swarm" />
                    Swarm plot
                  </label>
                )}
              {mode === "bivariate" &&
                typeOne === "categorical" &&
                typeTwo === "categorical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="count" />
                    Count plot
                  </label>
                )}
              {mode === "bivariate" &&
                typeOne === "categorical" &&
                typeTwo === "categorical" && (
                  <label className={styles.radioLabel}>
                    <input type="radio" name="visual" value="stack" />
                    Stack bar
                  </label>
                )}
            </div>
            <button type="submit" className={styles.submitButton}>
              Analyze
            </button>
          </form>
          <div className={styles.resultContainer}>
            {result.analysis && result.analysis.std && (
              <div className={styles.analysisBox}>
                <span>Total: {result.analysis.count}</span>
                <span>Min: {result.analysis.min}</span>
                <span>Max: {result.analysis.max}</span>
                <span>Median: {result.analysis["50%"]}</span>
                {result.analysis["ci95_lower"] && (
                  <span>
                    Range: [{result.analysis["ci95_lower"].toFixed(4)},{" "}
                    {result.analysis["ci95_upper"].toFixed(4)}]
                  </span>
                )}
                {result.analysis.variance && (
                  <span>Variance: {result.analysis.variance}</span>
                )}
              </div>
            )}
            {result.analysis && result.analysis.unique && (
              <div className={styles.analysisBox}>
                <span>Total: {result.analysis.count}</span>
                <span>Distinct value: {result.analysis.unique}</span>
                <span>Most frequent value: {result.analysis.top}</span>
                <span>Frequency: {result.analysis.freq}</span>
              </div>
            )}
            {result.visualization ? (
              <div className={styles.visualBox}>
                <img
                  src={result.visualization}
                  alt="graph"
                  className={styles.graphImage}
                ></img>
              </div>
            ) : (
              <></>
            )}
            {!result.analysis && !result.visualization && (
              <div className={styles.advice}>
                Do some analytics in the left!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
