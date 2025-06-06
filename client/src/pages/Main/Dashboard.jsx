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
    </>
  );
}
