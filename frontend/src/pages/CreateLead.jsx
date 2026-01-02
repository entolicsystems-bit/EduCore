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

<<<<<<< HEAD
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const existingLeads =
      JSON.parse(localStorage.getItem("leads")) || [];
=======
  const [errors, setErrors] = useState({});

  // HANDLE CHANGE (phone digits only)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d*$/.test(value)) return;

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // VALIDATION
  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (form.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.owner.trim()) {
      newErrors.owner = "Owner is required";
    }

    if (!form.source) {
      newErrors.source = "Source is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SAVE
  const handleSave = () => {
    if (!validateForm()) return;

    const existingLeads = JSON.parse(localStorage.getItem("leads")) || [];
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515

    const newLead = {
      id: Date.now().toString(),
      ...form,
      status: "NEW",
    };

<<<<<<< HEAD
    localStorage.setItem(
      "leads",
      JSON.stringify([...existingLeads, newLead])
    );
=======
    localStorage.setItem("leads", JSON.stringify([...existingLeads, newLead]));
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515

    navigate("/leads");
  };

  return (
    <DashboardLayout>
      <div className="create-lead-page">
<<<<<<< HEAD
        {/* BACK */}
        <div className="back-btn" onClick={() => navigate("/leads")}>
          
        </div>

        {/* CARD */}
        <div className="create-lead-card">
          <h2>Create Lead</h2>
=======
        <div className="create-lead-card">
          <h2 className="font-bold text-2xl">Create Lead</h2>
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515

          {/* FORM */}
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
<<<<<<< HEAD
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
=======
              <input name="name" value={form.name} onChange={handleChange} />
              {errors.name && <small className="error">{errors.name}</small>}
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
<<<<<<< HEAD
              />
=======
                maxLength={10}
              />
              {errors.phone && <small className="error">{errors.phone}</small>}
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
<<<<<<< HEAD
=======
              {errors.email && <small className="error">{errors.email}</small>}
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
            </div>

            <div className="form-group">
              <label>Owner</label>
<<<<<<< HEAD
              <input
                name="owner"
                value={form.owner}
                onChange={handleChange}
              />
=======
              <input name="owner" value={form.owner} onChange={handleChange} />
              {errors.owner && <small className="error">{errors.owner}</small>}
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
            </div>

            <div className="form-group full-width">
              <label>Source</label>
<<<<<<< HEAD
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
              >
                <option value="">Select source</option>
=======
              <select name="source" value={form.source} onChange={handleChange}>
                <option value="" className="text-sm">
                  Select source
                </option>
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
              </select>
<<<<<<< HEAD
=======
              {errors.source && (
                <small className="error">{errors.source}</small>
              )}
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
            </div>
          </div>

          {/* ACTIONS */}
          <div className="actions">
            <button
<<<<<<< HEAD
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
=======
              className="btn-cancel cursor-pointer"
              onClick={() => navigate("/leads")}
            >
              Cancel
            </button>

            <button className="btn-save cursor-pointer" onClick={handleSave}>
              Save
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateLead;
