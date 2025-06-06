import ErrorPage from "./pages/ErrorPage";
import Auth from "./pages/Auth/Auth";
import ProtectedRoute from "./ProtectedRoute"; // protected route for dashboard

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
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/:name",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
