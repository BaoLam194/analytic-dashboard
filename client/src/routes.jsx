import ErrorPage from "./pages/ErrorPage";
import Auth from "./pages/Auth/Auth";
import ProtectedRoute from "./ProtectedRoute"; // protected route for dashboard
import Dashboard from "./pages/Main/Dashboard";
import AnalyticBoard from "./components/AnalyticDisplayer";

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
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/:name",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/analytic",
    element: <AnalyticBoard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/analytic/:file",
    element: <AnalyticBoard />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
