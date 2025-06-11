import { useContext } from "react";
import { UserContext } from "../../UserContext";

export default function Dashboard() {
  const { token, setToken } = useContext(UserContext);
  if (!token) return <div>Loading...</div>;

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

      <form method="POST" action="/api/test">
        <h2>Upload your file</h2>
        <label for="file">File:</label>
        <input id="file" type="file" name="file" accept=".csv, .xlsx"></input>
        <button type="submit">Submit your file</button>
      </form>
    </>
  );
}
