import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Header */}
      <Navbar />
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
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

          <div
            className="sidebar-footer text-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <button className="font-bold text-gray-400">Logout</button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="content">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
