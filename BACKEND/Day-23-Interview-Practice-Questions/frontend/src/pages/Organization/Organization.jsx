import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import './Organization.modules.css';
import { toast } from "react-toastify";

const Field = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div className="co-field">
    <label className="co-label">{label}</label>
    <input className="co-input" type={type} placeholder={placeholder}
      value={value} onChange={onChange} />
  </div>
);

export default function CreateOrganization() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [section, setSection] = useState(0);

  const [form, setForm] = useState({
    legalName: "", dbaName: "",
    address: { street: "", city: "", state: "", zip: "", country: "" },
    primaryContact: { name: "", email: "" },
    phoneNumber: "", website: "",
    identifiers: { labellerCode: "", dunsNumber: "", cin: "", gstin: "", pan: "", cdsco: "", others: "" },
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setNested = (group, k) => (e) =>
    setForm((p) => ({ ...p, [group]: { ...p[group], [k]: e.target.value } }));

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: "", type: "" }), 5000);
  };

  const handleSubmit = async () => {
    if (!form.legalName || !form.dbaName)
      return showAlert("Legal Name and DBA Name are required.", "error");

    setLoading(true);
    try {
      await api.post("/organizations", form);
      toast.success("Organization created successfully!", "success");
      setTimeout(() => navigate("/organizations"), 1800);
    } catch (err) {
      showAlert(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const SECTIONS = ["Basic Info", "Address", "Contact", "Identifiers"];


  return (
    <div className="co-root">
      <div className="co-right">
        <div className="co-card">
          <div className="co-form-tag">Organisation Management</div>
          <h2 className="co-form-title">Create Organisation</h2>
          <p className="co-form-desc">Fill in the details to register a new organisation.</p>

          {alert.msg && (
            <div className={`co-alert show ${alert.type}`}>{alert.msg}</div>
          )}

          {/* Steps */}
          <div className="co-steps">
            {SECTIONS.map((s, i) => (
              <button key={i} className={`co-step ${section === i ? "active" : ""} ${i < section ? "done" : ""}`}
                onClick={() => setSection(i)}>
                <span className="co-step-num">{i < section ? <img src='../../icons/checked.png' alt='results' width="20"/> : i + 1}</span>
                <span className="co-step-label">{s}</span>
              </button>
            ))}
          </div>

          <div className="co-fields">
            {/* Section 0 — Basic Info */}
            {section === 0 && (
              <>
                <Field label="Legal Name *" placeholder="Acme Pharmaceuticals Ltd."
                  value={form.legalName} onChange={set("legalName")} />
                <Field label="DBA Name *" placeholder="Acme Pharma"
                  value={form.dbaName} onChange={set("dbaName")} />
                <Field label="Phone Number" placeholder="+1 800 000 0000"
                  value={form.phoneNumber} onChange={set("phoneNumber")} />
                <Field label="Website" placeholder="https://example.com" type="url"
                  value={form.website} onChange={set("website")} />
              </>
            )}

            {/* Section 1 — Address */}
            {section === 1 && (
              <>
                <Field label="Street" placeholder="123 Main Street"
                  value={form.address.street} onChange={setNested("address", "street")} />
                <div className="co-row">
                  <Field label="City" placeholder="New York"
                    value={form.address.city} onChange={setNested("address", "city")} />
                  <Field label="State" placeholder="NY"
                    value={form.address.state} onChange={setNested("address", "state")} />
                </div>
                <div className="co-row">
                  <Field label="ZIP Code" placeholder="10001"
                    value={form.address.zip} onChange={setNested("address", "zip")} />
                  <Field label="Country" placeholder="United States"
                    value={form.address.country} onChange={setNested("address", "country")} />
                </div>
              </>
            )}

            {/* Section 2 — Contact */}
            {section === 2 && (
              <>
                <Field label="Contact Name" placeholder="Jane Whitfield"
                  value={form.primaryContact.name} onChange={setNested("primaryContact", "name")} />
                <Field label="Contact Email" placeholder="jane@organisation.com" type="email"
                  value={form.primaryContact.email} onChange={setNested("primaryContact", "email")} />
              </>
            )}

            {/* Section 3 — Identifiers */}
            {section === 3 && (
              <>
                <div className="co-row">
                  <Field label="Labeller Code" placeholder="LBL-001"
                    value={form.identifiers.labellerCode} onChange={setNested("identifiers", "labellerCode")} />
                  <Field label="DUNS Number" placeholder="12-345-6789"
                    value={form.identifiers.dunsNumber} onChange={setNested("identifiers", "dunsNumber")} />
                </div>
                <div className="co-row">
                  <Field label="CIN" placeholder="U12345MH2020PTC000001"
                    value={form.identifiers.cin} onChange={setNested("identifiers", "cin")} />
                  <Field label="GSTIN" placeholder="22AAAAA0000A1Z5"
                    value={form.identifiers.gstin} onChange={setNested("identifiers", "gstin")} />
                </div>
                <div className="co-row">
                  <Field label="PAN" placeholder="AAAAA0000A"
                    value={form.identifiers.pan} onChange={setNested("identifiers", "pan")} />
                  <Field label="CDSCO" placeholder="CDSCO-REG-001"
                    value={form.identifiers.cdsco} onChange={setNested("identifiers", "cdsco")} />
                </div>
                <Field label="Others" placeholder="Any other identifier"
                  value={form.identifiers.others} onChange={setNested("identifiers", "others")} />
              </>
            )}

            {/* Navigation */}
            <div className="co-nav">
              {section > 0 && (
                <button className="co-btn-ghost" onClick={() => setSection(section - 1)}>
                  ← Back
                </button>
              )}
              {section < SECTIONS.length - 1 ? (
                <button className="co-btn" onClick={() => setSection(section + 1)}>
                  Continue →
                </button>
              ) : (
                <button className="co-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creating…" : "Create Organisation"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}