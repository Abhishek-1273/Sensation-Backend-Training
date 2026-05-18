import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import GetNavigation from "./GetNavigation";
import { useAuth } from "../context/AuthContext.jsx";
import { useAppTheme } from "../context/ThemeContext.jsx";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function Layout() {
  const { user } = useAuth();
  const { theme, mode, toggleTheme } = useAppTheme();
  const NAVIGATION = GetNavigation(user);

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
      theme={theme}
      branding={{
        title: (
          <span style={{ color: "#0d9488", fontFamily: 'Averia Libre', fontSize: "30px", fontWeight: "900" }}>
            Compliance Analysis
          </span>
        ),
        logo: <></>,
      }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => (
            <IconButton onClick={toggleTheme} color="inherit" title="Toggle theme">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          ),
        }}
      >
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;