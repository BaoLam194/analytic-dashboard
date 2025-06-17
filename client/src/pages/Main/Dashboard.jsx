import { useContext, useEffect } from "react";
import { UserContext } from "../../UserContext";
import DataDisplayer from "../../components/DataDisplayer";

export default function Dashboard() {
  const { token, setToken } = useContext(UserContext);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await fetch("/api/userinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.user.id}`,
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Unknown error");
        }
      } catch (error) {
        alert("Encouter some error: " + error.message);
      }
    }

    fetchUserInfo();
  }, [token]);
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
      <DataDisplayer />
    </>
  );
}
