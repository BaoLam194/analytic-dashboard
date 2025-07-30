import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ErrorPage() {
  return (
    <>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <h1>There is nothing here, maybe you have type in the url wrong.</h1>
      <Link to="/">Press here to come back home</Link>
    </>
  );
}
