import { useParams, useNavigate } from "react-router-dom";
import { updateLead, getLeadById } from "../services/leadService";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import "./LeadDetails.css";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);

  // load lead
  useEffect(() => {
    const loadLead = async () => {
      try {
        setLoading(true);
        const res = await getLeadById(id);
        console.log(res.data);

        setLead(res.data.lead || res.data);
      } catch (error) {
        console.error("Failed to load lead", error);
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [id]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  // save updated lead
  const handleSave = async () => {
    try {
      setLoading(true);

      await updateLead(id, {
        phone: lead.phone,
        email: lead.email,
        status: lead.status,
      });

      // update localStorage
      // const leads = JSON.parse(localStorage.getItem("leads")) || [];
      // const updatedLeads = leads.map((l) => (String(l.id) === id ? lead : l));
      // localStorage.setItem("leads", JSON.stringify(updatedLeads));

      alert("Lead updated successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to update lead");
    } finally {
      setLoading(false);
    }
  };

  if (!lead)
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="lead-details-page">
        {/* BACK */}
        <div className="back-row" onClick={() => navigate(-1)}></div>

        {/* TOP CARD */}
        <div className="lead-info-card">
          <div className="flex flex-col gap-2">
            <p>Lead: {lead.name}</p>
            <div>
              <label>Phone: </label>
              <input
                name="phone"
                value={lead.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email: </label>
              <input
                name="email"
                value={lead.email || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="lead-right">
            <div className="owner-box">
              <p>Owner: {lead.owner}</p>
            </div>

            <span className="status-label">Status:</span>
            <select
              className="status-select"
              name="status"
              value={lead.status || ""}
              onChange={handleChange}
            >
              <option value="NEW">New</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="CONTACTED">Contacted</option>
            </select>

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="details-grid">
          <div className="card notes-card">
            <h3>Notes</h3>
            <textarea placeholder="add a quick note" />
          </div>

          <div className="card timeline-card">
            <h3>Timeline</h3>

            <div className="timeline">
              <div className="timeline-item">
                <span className="dot z-10"></span>
                <div>
                  Lead Created
                  <p>Lead was created from {lead.source} form</p>
                  <p className="muted">
                    {new Date(lead.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <span className="dot z-10"></span>
                <div>
                  STATUS CHANGED
                  <p className="muted">
                    {lead.name} • {new Date(lead.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadDetails;
