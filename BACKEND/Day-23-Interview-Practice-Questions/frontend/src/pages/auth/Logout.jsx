import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify"

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loggingOut = async () => {
      try {
        await logout();
        toast.success("Log out successfully")
        navigate("/", { replace: true });
      } catch (err) {
        console.log(err.message)
      }
    };
    loggingOut()
  }, [])
}
export default Logout;


