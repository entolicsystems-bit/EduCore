import { NavLink } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">EntoCrm</h2>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/leads" className="active">Leads</NavLink>
          <NavLink to="/admissions">Admissions</NavLink>
          <NavLink to="/students">Students</NavLink>
          <NavLink to="/finance">Finance</NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/users">Users & Roles</NavLink>
          <NavLink to="/logout">Logout</NavLink>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
