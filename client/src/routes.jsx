import ErrorPage from "./pages/ErrorPage";
import Auth from "./pages/Auth/Auth";
import {
  RedirectedProtectedRoute,
  RedirectedProtectedNoRoute,
  SafeRoute,
} from "./ProtectedRoute"; // protected route for dashboard
import AnalyticBoard from "./pages/Main/AnalyticDisplayer";

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
    element: <SafeRoute />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/:name",
    element: (
      <RedirectedProtectedRoute>
        <Auth />
      </RedirectedProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/analytic/",
    element: (
      <RedirectedProtectedNoRoute>
        <AnalyticBoard />
      </RedirectedProtectedNoRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/analytic/:file",
    element: (
      <RedirectedProtectedNoRoute>
        <AnalyticBoard />
      </RedirectedProtectedNoRoute>
    ),
    errorElement: <ErrorPage />,
  },
];

export default routes;
