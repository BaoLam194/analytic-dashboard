import { useContext, useEffect } from "react";
import { UserContext } from "../../UserContext";
import DataDisplayer from "../../components/DataDisplayer";

export default function Dashboard() {
  const { token, setToken } = useContext(UserContext);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        // eslint-disable-next-line no-unused-vars
        const res = await fetch("/api/userinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.user.id}`,
          },
        });
      } catch (error) {
        console.log(error);
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
