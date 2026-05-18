import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api.js";
import './Signin.css'
import { useAuth } from "../../context/AuthContext.jsx"
import { toast } from "react-toastify";

export default function Signin() {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(form)
      if (response.status === 200) {
        toast.success("Signin successful")
        navigate('/')
      }
    } catch (err) {
      toast(err.response?.data?.message || "Invalid email or password")
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
    <>
      <form onSubmit={handleSubmit}>
        <div className="si-root">
          <div className="si">
            <div className="si-card">
              <div className="si-form-tag">Authorised Personnel Only</div>
              <h2 className="si-form-title">Welcome Back</h2>
              <p className="si-form-desc">
                New to the platform? <a href="/signup">Sign up →</a>
              </p>

              {alert.msg && (
                <div className={`si-alert show ${alert.type}`}>{alert.msg}</div>
              )}

              <div className="si-fields">
                {/* Email */}
                <div className="si-field">
                  <label className="si-label">Email Address</label>
                  <div className="si-wrap">
                    <svg className="si-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                    </svg>
                    <input className="si-input" name="email" type="email" placeholder="your@organization.com"
                      value={form.email} onChange={handleChange}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)} />
                  </div>
                </div>

                {/* Password */}
                <div className="si-field">
                  <label className="si-label">
                    <span>Password</span>
                    <a href="/forgot-password" className="si-forgot">Forgot password?</a>
                  </label>
                  <div className="si-wrap">
                    <svg className="si-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input className="si-input" name="password" type={showPwd ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password} onChange={handleChange}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)} />
                    <button className="si-eye" type="button" onClick={() => setShowPwd(!showPwd)}>
                      <EyeIcon open={showPwd} />
                    </button>
                  </div>
                  {error && <div className="si-error">{error}</div>}
                </div>

                {/* Remember */}
                <div className="si-check-row" onClick={() => setRemember(!remember)}>
                  <div className={`si-checkbox ${remember ? "on" : ""}`}>
                    {remember && (
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    )}
                  </div>
                  <span className="si-check-label">Keep me signed in for 24 hours</span>
                </div>

                <button className="si-btn" type="submit" disabled={loading}>
                  {loading ? "Authenticating…" : "Access Platform"}
                </button>

                <div className="si-session">
                  <span className="si-session-txt">
                    <span className="si-live" />
                    TLS 1.3 Encrypted
                  </span>
                  <span className="si-session-txt">Session · 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}