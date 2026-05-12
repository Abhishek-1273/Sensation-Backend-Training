import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ComplianceEngine from "./pages/ComplianceEngine/ComplianceEngine.jsx";
import Organization from "./pages/Organization/Organization.jsx";
import Product from "./pages/Product/Product.jsx";
import RuleAndPolicies from "./pages/RuleAndPolicies/RuleAndPolicies.jsx";
import Reports from "./pages/Reports/Reports.jsx";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import { AuthProvider } from "../src/context/AuthContext.jsx";
import { ThemeContextProvider } from "../src/context/ThemeContext.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import Logout from "./pages/auth/Logout.jsx";
import { ToastContainer } from 'react-toastify';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/organization",
              element: <Organization />,
            },
            {
              path: "/products",
              element: <Product />,
            },
            {
              path: "/RuleAndPolicies",
              element: <RuleAndPolicies />,
            },
            {
              path: "/compliance-engine",
              element: <ComplianceEngine />
            },
            {
              path: "/reports",
              element: <Reports />,
            },
          ]
        },
        {
          path: "/signin",
          element: <Signin />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ]);
  return (
    <>
      <AuthProvider>
        <ThemeContextProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={2000} style={{ top: "70px" }} />
        </ThemeContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;
