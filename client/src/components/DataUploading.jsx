import { useState } from "react";
import styles from "./DataUploading.module.css";

export default function DataUpload({ files, setFiles }) {
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
      });

      const result = await response.json();
      const newFiles = [...files, file.name].sort();
      setFiles(newFiles);
      alert(result.message || "File uploaded");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Error uploading file.");
    }
  };
  return (
    <>
      <input
        id="file"
        type="file"
        name="file"
        accept=".csv, .xlsx"
        onChange={handleFileChange}
        className={styles.thisinput}
      />
      <button type="submit" onClick={handleSubmit} className={styles.button}>
        Submit your file
      </button>
    </>
  );
}
