import { NavLink } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">
          EntoCrm</h2>

       <nav className="sidebar-nav">
  <NavLink
    to="/dashboard"
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    Dashboard
  </NavLink>

  <NavLink
    to="/leads"
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    Leads
  </NavLink>

  <NavLink
    to="/admissions"
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    Admissions
  </NavLink>

  <NavLink
    to="/students"
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    Students
  </NavLink>

  <NavLink
    to="/finance"
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    Finance
  </NavLink>

  <NavLink
    to="/settings"
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    Settings
  </NavLink>

  <NavLink
    to="/users-roles"
    className={({ isActive }) => (isActive ? "active" : "")}
  >
    Users & Roles
  </NavLink>
</nav>


        <div className="sidebar-footer">
          {/* <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/users">Users & Roles</NavLink> */}
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
