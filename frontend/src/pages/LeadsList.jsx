import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./Leads.css";

const leads = [
  {
    id: 1,
    name: "rushikesh",
    email: "rushikesh123@gmail.com",
    phone: "8585858585",
    source: "Website",
    owner: "saurav",
    status: "NEW",
  },
  {
    id: 2,
    name: "saurav",
    email: "saurav123@gmail.com",
    phone: "6545217865",
    source: "Referral",
    owner: "rushikesh",
    status: "FOLLOW_UP",
  },
  {
    id: 3,
    name: "ajay",
    email: "ajay123@gmail.com",
    phone: "8527419637",
    source: "Social Media",
    owner: "ajay",
    status: "CONTACTED",
  },
];


const Leads = () => {
    const navigate = useNavigate();
  return (
    <DashboardLayout >
    <div className="leads-page">
      {/* HEADER */}
      <div className="leads-header">
        <h2>Leads</h2>

        <div className="header-actions">
          <button className="btn-outline">Import CSV</button>
          <button className="btn-primary"
          onClick={()=> navigate("/leads/create")}>
            Create Lead</button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <select>
          <option>All Status</option>
        </select>

        <select>
          <option>All Sources</option>
        </select>

        <select>
          <option>All Owners</option>
        </select>

        <input type="text" placeholder="Search leads..." />
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>PHONE</th>
              <th>SOURCE</th>
              <th>OWNER</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div className="name-cell">
                    <strong>{lead.name}</strong>
                    <span>{lead.email}</span>
                  </div>
                </td>
                <td>{lead.phone}</td>
                <td>{lead.source}</td>
                <td>
                  <div className="owner-badge">
                    {lead.owner.charAt(0).toUpperCase()}
                  </div>
                  {lead.owner}
                </td>
                <td>
                  <span className={`status ${lead.status.toLowerCase()}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <span>Showing 1 to 9 of 124 results</span>

        <div className="pages">
          <button>{"<"}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
        </div>
      </div>
    </div>
    </DashboardLayout > 
  );
};

export default Leads;
