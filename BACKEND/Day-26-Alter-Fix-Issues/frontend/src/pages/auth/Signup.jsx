import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import './Signup.css'
import { toast } from "react-toastify";

export default function SignUp() {
  const [form, setForm] = useState({ userName: "", email: "", password: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: "", type: "" }), 5000);
  };

  useEffect(() => {
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match");
    } else {
      setValidationError("");
    }
  }, [form.password, form.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userName || !form.email || !form.password)
      return toast.error("All fields are required.", "error");
    if (form.password.length < 8)
      return showAlert("Password must be at least 8 characters.", "error");
    if (form.password !== form.confirmPassword)
      return showAlert("Passwords do not match.", "error");

    setLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        userName: form.userName,
        email: form.email,
        password: form.password,
      });
      toast.success("Account created! Redirecting to sign in…", "success");
      setTimeout(() => navigate("/signin"), 1800);
    } catch (err) {
      showAlert(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ open }) =>
    open ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  return (
    <form onSubmit={handleSubmit}>
    <div className="su-root">
      <div className="su">
        <div className="su-card">
          <div className="su-form-tag">New Account Registration</div>
          <h2 className="su-form-title">Create Account</h2>
          <p className="su-form-desc">
            Already registered? <a href="/signin">Sign in →</a>
          </p>

          {alert.msg && (
            <div className={`su-alert show ${alert.type}`}>{alert.msg}</div>
          )}

          <div className="su-fields">
            {/* Full Name */}
            <div className="su-field">
              <label className="su-label">Full Name</label>
              <div className="su-wrap">
                <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <input className="su-input" type="text" placeholder="Jane Whitfield"
                  value={form.userName} onChange={set("userName")} />
              </div>
            </div>

            {/* Email */}
            <div className="su-field">
              <label className="su-label">Email Address</label>
              <div className="su-wrap">
                <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                </svg>
                <input className="su-input" type="email" placeholder="jane@organization.com"
                  value={form.email} onChange={set("email")} />
              </div>
            </div>

            {/* Password */}
            <div className="su-field">
              <label className="su-label">Password</label>
              <div className="su-wrap">
                <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input className="su-input" type={showPwd ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={set("password")} />
                <button className="su-eye" type="button" onClick={() => setShowPwd(!showPwd)}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="su-field">
              <label className="su-label">Confirm Password</label>
              <div className="su-wrap">
                <svg className="su-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input className="su-input" type={showConfirmPwd ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword} onChange={set("confirmPassword")} />
                <button className="su-eye" type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                  <EyeIcon open={showConfirmPwd} />
                </button>
              </div>
              {validationError && (
                <span style={{ fontSize: ".65rem", color: "#e88", fontFamily: "'DM Mono', monospace" }}>
                  {validationError}
                </span>
              )}
            </div>

            {/* <div className="su-divider"><span>Terms of Access</span></div>

            <div className="su-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              <p>By creating an account you agree to our data processing terms and confirm this access is for authorised organizational use only.</p>
            </div> */}

            <button className="su-btn" type="submit" disabled={loading}>
              {loading ? "Processing…" : "Create Secure Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </form>
  );
}