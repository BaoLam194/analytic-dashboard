import { useState, useEffect } from "react";
import DataUpload from "./DataUploading";
import styles from "./DataUploading.module.css";

export default function DataDisplayer({ validated }) {
  const [files, setFiles] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/file/show");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }
      const result = await res.json(); // Parse the response

      setFiles(result);
      console.log(result);
    } catch (err) {
      alert("Error fetching file info:", err);
    }
  };
  useEffect(() => {
    fetchFiles();
  }, [validated]);
  const confirmRemove = (file) => {
    setFileToDelete(file);
    setShowModal(true);
  };
  const handleRemove = async (file) => {
    try {
      const res = await fetch(`/api/file/delete/${file}`, {
        method: "POST",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Unknown error");
      }
      const data = files.filter((thisFile) => thisFile !== file);
      setFiles(data);
    } catch (err) {
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
        {files ? (
          <ul className={styles.fileList}>
            {files.map((file, index) => (
              <li key={index} className={styles.fileItem}>
                <span title={file}>{file}</span>
                <button
                  className={styles.removeButton}
                  onClick={() => confirmRemove(file)}
                >
                  X
                </button>
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
