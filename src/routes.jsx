import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Auth from "./pages/Auth";

// this is for testing
// const routes = [
//   {
//     path: "/",
//     element: <ErrorPage />,
//   },
// ];

//real router
const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/:name",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
