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
              to="/student-page"
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

            <hr className="border-gray-300 my-4" />

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
            className="sidebar-footer text-left cursor-pointer border-t-2 border-gray-300"
            onClick={() => navigate("/login")}
          >
            <button className=" text-gray-500 pt-4">Logout</button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="content">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
