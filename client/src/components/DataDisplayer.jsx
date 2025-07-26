import { useState, useEffect, useContext } from "react";
import DataUpload from "./DataUploading";
import styles from "./DataUploading.module.css";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
export default function DataDisplayer({ validated }) {
  const { token } = useContext(UserContext);
  const [files, setFiles] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API_URL}/file/show`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.user.id}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }
      const result = await res.json(); // Parse the response
      //also result don't have property length
      setFiles(result);

      console.log(result);
      toast.success("File fetched successfully! File system is up to date!");
    } catch (err) {
      toast.error("Error fetching file info:", err);
      alert("Error fetching file info:", err);
    }
  };
  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated]);
  const confirmRemove = (file) => {
    setFileToDelete(file);
    setShowModal(true);
  };
  const handleRemove = async (file) => {
    try {
      const res = await fetch(`${API_URL}/file/delete/${file}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.user.id}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }
      const data = files.filter((thisFile) => thisFile !== file);
      setFiles(data);
      toast.success("You have removed the file");
    } catch (err) {
      toast.error("Error deleting file:", err.message);
      alert("Can not find file :" + err.message);
    } finally {
      setShowModal(false);
      setFileToDelete(null);
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <DataUpload files={files} setFiles={setFiles} />
          <button onClick={fetchFiles} className={styles.refreshButton}>
            Refresh
          </button>
        </div>
        {files && files.length > 0 ? ( // Empty arrays are TRUE in JS :))))
          <ul className={styles.fileList}>
            {files.map((file, index) => (
              <li key={index} className={styles.fileItem}>
                <span title={file}>{file}</span>
                <div className={styles["nav-btn"]}>
                  <Link to={`/analytic/${file}`}>
                    <img src="/analysis-go.svg" alt="logo" />
                  </Link>
                  <button
                    className={styles.removeButton}
                    onClick={() => confirmRemove(file)}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>Nothing found!</div>
        )}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <p>Are you sure you want to delete "{fileToDelete}"?</p>
              <div className={styles.modalButtons}>
                <button
                  onClick={() => handleRemove(fileToDelete)}
                  className={styles.confirmButton}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFileToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
