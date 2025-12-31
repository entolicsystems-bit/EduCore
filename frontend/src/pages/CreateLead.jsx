import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./CreateLead.css";

const CreateLead = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    owner: "",
    source: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const existingLeads =
      JSON.parse(localStorage.getItem("leads")) || [];

    const newLead = {
      id: Date.now().toString(),
      ...form,
      status: "NEW",
    };

    localStorage.setItem(
      "leads",
      JSON.stringify([...existingLeads, newLead])
    );

    navigate("/leads");
  };

  return (
    <DashboardLayout>
      <div className="create-lead-page">
        {/* BACK */}
        <div className="back-btn" onClick={() => navigate("/leads")}>
          
        </div>

        {/* CARD */}
        <div className="create-lead-card">
          <h2>Create Lead</h2>

          {/* FORM */}
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Owner</label>
              <input
                name="owner"
                value={form.owner}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Source</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
              >
                <option value="">Select source</option>
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
              </select>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="actions">
            <button
              className="btn-cancel"
              onClick={() => navigate("/leads")}
            >
              cancel
            </button>

            <button
              className="btn-save"
              onClick={handleSave}
            >
              save
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateLead;
