import "./Auth.css";
import { useParams } from "react-router-dom";

export default function Auth() {
  const { name } = useParams(); //router access

  return <div className="bg-color flex">testing again</div>;
}
