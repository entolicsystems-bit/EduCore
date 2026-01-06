import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { createLead } from "../services/leadService";
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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
  const handleSave = async () => {
    if (!validateForm()) return;

    try{
      setLoading(true);

      await createLead({
        name: form.name,
        phone: form.phone,
        email: form.owner,
        source: form.source,
      });
 
      navigate("/leads");
    }catch (error){
      console.error("Create lead failed", error);

      if (error.response?.data?.mesaage){
        alert(error.response.data.mesaage);
      } else{
        alert("something went wrong, Please try agin.");
      }
    } finally{
      setLoading(false);
    }

    // const existingLeads = JSON.parse(localStorage.getItem("leads")) || [];

    // const newLead = {
    //   id: Date.now().toString(),
    //   ...form,
    //   status: "NEW",
    // };

    // localStorage.setItem("leads", JSON.stringify([...existingLeads, newLead]));

    // navigate("/leads");
  };

  return (
    <DashboardLayout>
      <div className="create-lead-page">
        <div className="create-lead-card">
          <h2 className="font-bold text-2xl">Create Lead</h2>

          {/* FORM */}
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} />
              {errors.name && <small className="error">{errors.name}</small>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.phone && <small className="error">{errors.phone}</small>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>

            <div className="form-group">
              <label>Owner</label>
              <input name="owner" value={form.owner} onChange={handleChange} />
              {errors.owner && <small className="error">{errors.owner}</small>}
            </div>

            <div className="form-group full-width">
              <select name="source" value={form.source} onChange={handleChange}>
                <option value="" className="text-sm">
                  Source
                </option>
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
              </select>
              {errors.source && (
                <small className="error">{errors.source}</small>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className=" flex justify-center gap-8 mt-6">
            <button
              className="btn-cancel cursor-pointer"
              onClick={() => navigate("/leads")}
              disabled = {loading}
            >
              Cancel
            </button>

            <button className="btn-save cursor-pointer" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateLead;
