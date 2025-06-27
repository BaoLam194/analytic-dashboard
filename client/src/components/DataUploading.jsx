import { useState, useContext } from "react";
import styles from "./DataUploading.module.css";
import { UserContext } from "../UserContext";

export default function DataUpload({ files, setFiles }) {
  const { token } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/file/uploading", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token.user.id}`,
        },
      });
      if (!response.ok) {
        throw new Error("Try go back to mainpage and refresh");
      }

      const result = await response.json();
      const newFiles = [...files, file.name].sort();
      setFiles(newFiles);
      alert(result.message || "File uploaded");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Request failed: " + err.message);
    }
  };
  return (
    <>
      <input
        id="file"
        type="file"
        name="file"
        accept=".csv, .xlsx, .xls"
        onChange={handleFileChange}
        className={styles.thisinput}
      />
      <button type="submit" onClick={handleSubmit} className={styles.button}>
        Submit your file
      </button>
    </>
  );
}
