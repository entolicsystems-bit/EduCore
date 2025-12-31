import DashboardLayout from "../layouts/DashboardLayout";
import "./CreateLead.css";
import { useNavigate } from "react-router-dom";

const CreateLead = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="create-lead-page">
        {/* BACK ARROW */}
        <div className="back-btn" onClick={() => navigate("/leads")}>
          ←
        </div>

        {/* CARD */}
        <div className="create-lead-card">
          <h2>Create Lead</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" />
            </div>

            <div className="form-group">
              <label>Owner</label>
              <input type="text" />
            </div>

            <div className="form-group full-width">
              <label>Source</label>
              <select>
                <option>Select source</option>
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
                <option>Email Campaign</option>
              </select>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="actions">
            <button className="btn-cancel" onClick={() => navigate("/leads")}>
              cancel
            </button>
            <button className="btn-save">save</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateLead;
