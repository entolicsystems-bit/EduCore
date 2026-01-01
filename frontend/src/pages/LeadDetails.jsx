import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import "./LeadDetails.css";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    const storedLeads = JSON.parse(localStorage.getItem("leads")) || [];
    const selectedLead = storedLeads.find(
      (l) => String(l.id) === id
    );
    setLead(selectedLead);
  }, [id]);

  if (!lead)
     return null;

  return (
    <DashboardLayout>
      <div className="lead-details-page">

        {/* BACK */}
        <div className="back-row" onClick={() => navigate(-1)}>
          
        </div>

        {/* TOP CARD */}
        <div className="lead-info-card">
          <div className="lead-left">
            <p>Lead:{lead.name}</p>
            <p>Phone:{lead.phone}</p>
            <p>Email:{lead.email}</p>
          </div>

          <div className="lead-right">
            <div className="owner-box">
            <p>Owner: {lead.owner}</p>
            </div>

            <span class="status-label">Status:</span>
            <select className="status-select" defaultValue={lead.status}>
              <option value="NEW">New</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="CONTACTED">Contacted</option>
            </select>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="details-grid">

          {/* NOTES */}
          <div className="card notes-card">
            <h3>Notes</h3>
            <textarea placeholder="add a quick note" />
            <button className="save-btn">save</button>
          </div>

          {/* TIMELINE */}
          <div className="card timeline-card">
            <h3>Timeline</h3>

            <div className="timeline">
              <div className="timeline-item">
                <span className="dot"></span>
                <div>
                  Lead Created
                  <p>Lead was created from website form</p>
                  <p className="muted">System • Dec 10, 2025, 09:00 AM</p>
                </div>
              </div>

              <div className="timeline-item">
                <span className="dot"></span>
                <div>
                 STATUS CHANGED: NEW → FOLLOW_UP
                  <p className="muted">
                    {lead.name} • Dec 10, 2025, 10:30 AM
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
