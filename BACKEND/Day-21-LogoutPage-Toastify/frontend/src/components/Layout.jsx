import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import GetNavigation from "./GetNavigation";
import { useAuth } from "../context/AuthContext.jsx";


function Layout() {

  const { user } = useAuth()
  const NAVIGATION = GetNavigation(user)
  
  const location = useLocation();
  const navigate = useNavigate();
  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  };


  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={{
        title: (
          <span style={{ color: "#ffc927", fontFamily: 'DM Mono , monospace', fontSize: "25px", fontWeight: "400" }}>
            Compliance Analysis
          </span>
        ),
        logo: <></>,
      }}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;
