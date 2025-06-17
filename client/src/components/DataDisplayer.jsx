import { useState } from "react";
import DataUpload from "./DataUploading";

export default function DataDisplayer() {
  const [files, setFiles] = useState(null);
  return (
    <>
      <DataUpload />
      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/file/show");
            const result = await res.json(); // Parse the response
            setFiles(result);
            console.log(result); // See actual content here
          } catch (err) {
            console.error("Error fetching file info:", err);
          }
        }}
      >
        Refresh
      </button>
      {files ? (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      ) : (
        <div>testing v2</div>
      )}
    </>
  );
}
