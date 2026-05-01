import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from '@mui/icons-material/Login';
import CategoryIcon from '@mui/icons-material/Category';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DialerSipIcon from '@mui/icons-material/DialerSip';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PolicyIcon from '@mui/icons-material/Policy';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { createTheme } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#b8952a",
    },
    background: {
      default: "#0c0e10",
      paper: "#121417",
    },
  },
});


const NAVIGATION = [
  {
    segment: "",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "organization",
    title: "Organizations",
    icon: <ApartmentIcon />,
  },
  {
    segment: "products",
    title: "Products",
    icon: <CategoryIcon />,
  },
  {
    segment: "RuleAndPolicies",
    title: "Rules And Policies",
    icon: <PolicyIcon />,
  },
  {
    segment: "compliance-engine",
    title: "Compliance Engine",
    icon: <AssuredWorkloadIcon />,
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <AssessmentIcon />,
  },
  {
    kind: "divider",
  },
  {
    segment: "signup",
    title: "register",
    icon: <LoginIcon />,
  },
];
function Layout() {
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
          <span style={{ color: "#ffc927", fontFamily: 'DM Mono , monospace', fontSize: "25px", fontWeight: "400"}}>
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
