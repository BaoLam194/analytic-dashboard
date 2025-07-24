import { useState, useContext } from "react";
import styles from "./DataUploading.module.css";
import { UserContext } from "../UserContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function DataUpload({ files, setFiles }) {
  const { token } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //

    if (!file) {
      toast.error("Please select a file first.");
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
      const newFiles = result.message.includes("overwritten")
        ? [...files].sort()
        : [...files, file.name].sort();
      setFiles(newFiles);
      toast.success(result.message || "File uploaded");
    } catch (err) {
      console.error("Upload failed:", err);
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        toast.error("Please try again! Don't input unsupported files");
      } else {
        toast.error("Request failed: " + err.message);
      }
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
