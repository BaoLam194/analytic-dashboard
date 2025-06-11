import { useContext } from "react";
import { UserContext } from "../../UserContext";

export default function Dashboard() {
  const { token, setToken } = useContext(UserContext);
  if (!token) return <div>Loading...</div>;
  //automatically send back information
  async function userInfo() {
    try {
      const data = await fetch("/api/userinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.user.id}`,
        },
      });
      data;
    } catch (error) {
      console.log(error);
    }
  }
  userInfo();
  return (
    <>
      <div>Hello, {token?.user?.user_metadata?.userName}</div>
      <button
        onClick={() => {
          setToken(null);
        }}
      >
        Log out
      </button>

      <form
        action="/api/fileuploading"
        method="POST"
        enctype="multipart/form-data"
      >
        <h2>Upload your file</h2>
        <label htmlFor="file">File:</label>
        <input id="file" type="file" name="file" accept=".csv, .xlsx"></input>
        <button type="submit">Submit your file</button>
      </form>
    </>
  );
}
