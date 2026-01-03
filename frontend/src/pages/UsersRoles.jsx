import DashboardLayout from "../layouts/DashboardLayout";
import "./UserRoles.css";

const UsersRoles = () => {
  return (
    <DashboardLayout>
      <div className="roles-page">

        {/* PAGE HEADER */}
        <h2 className="page-title">Role Assignment</h2>
        <p className="page-subtitle">
          Assign or update user roles. Admin access only.
        </p>

        {/* SEARCH USER */}
        <div className="card">
          <h3>Search User</h3>
          <input
            className="search-input"
            placeholder="Search by name, email, or user ID" 
          />
        </div>

        {/* USER INFO */}
        <div className="card user-card">
          <div>
            <strong>Anmol Kumbhar</strong>
            <p>anmolkumbhar123@gmail.com</p>
          </div>
          <span className="status active">Active</span>
        </div>

        {/* ASSIGN ROLES */}
        <div className="card assign-roles-card">
          <h3>Assign Roles</h3>

          <div className="role-item">
            <input type="checkbox" />
            <div className="role-text">
              <strong>ADMIN</strong>
              <p>Full system access and user management</p>
            </div>
          </div>

          <div className="role-item">
            <input type="checkbox" defaultChecked />
            <div className="role-text">
              <strong>COUNSELLOR</strong>
              <p>Student counseling and guidance access</p>
            </div>
          </div>

          <div className="role-item">
            <input type="checkbox" />
            <div className="role-text">
              <strong>TEACHER</strong>
              <p>Course management and grading access</p>
            </div>
          </div>

          <div className="role-item">
            <input type="checkbox" />
            <div className="role-text">
              <strong>ACCOUNTANT</strong>
              <p>Financial records and billing access</p>
            </div>
          </div>

          <div className="role-item">
            <input type="checkbox" />
            <div className="role-text">
              <strong>PARENT</strong>
              <p>Student progress and communication access</p>
            </div>
          </div>

          <div className="actions">
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UsersRoles;
