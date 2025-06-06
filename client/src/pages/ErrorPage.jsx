import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <>
      <h1>There is nothing here, maybe you have type in the url wrong.</h1>
      <Link to="/">Press here to come back home</Link>
    </>
  );
}
