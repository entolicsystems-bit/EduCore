import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { searchUser, UpdateUserRoles } from "../services/userService";
import "./UserRoles.css";

const UsersRoles = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  //  FETCH USER (SEARCH)
  const handleSearch = async (e) => {
    if (e.key !== "Enter") return;

    console.log("Search input value:", search);
    

    try {
      const res = await searchUser(search.trim());

      // backend may return object or array
      const userData = Array.isArray(res.data) ? res.data[0] : res.data;

      setUser(userData);
      setRoles(userData.roles || []);
    } catch (err) {
      console.log(err);
      alert("User not found");
      setUser(null);
      setRoles([]);
    }
  };

  //  TOGGLE ROLE
  const toggleRole = (role) => {
    setRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  // SAVE ROLES
  const handleSave = async () => {
    try {
      await UpdateUserRoles(user.id, roles);
      alert("Roles updated successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to update roles");
    }
  };

  return (
    <DashboardLayout>
      <div className="roles-page">

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* USER INFO */}
        {user && (
          <>
            <div className="card user-card">
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <span className="status active">Active</span>
            </div>

            {/* ASSIGN ROLES */}
            <div className="card assign-roles-card">
              <h3>Assign Roles</h3>

              <div className="role-item">
                <input
                  type="checkbox"
                  checked={roles.includes("COUNSELLOR")}
                  onChange={() => toggleRole("COUNSELLOR")}
                />
                <div className="role-text">
                  <strong>COUNSELLOR</strong>
                  <p>Student counseling and guidance access</p>
                </div>
              </div>

              <div className="role-item">
                <input
                  type="checkbox"
                  checked={roles.includes("TEACHER")}
                  onChange={() => toggleRole("TEACHER")}
                />
                <div className="role-text">
                  <strong>TEACHER</strong>
                  <p>Course management and grading access</p>
                </div>
              </div>

              <div className="role-item">
                <input
                  type="checkbox"
                  checked={roles.includes("ACCOUNTANT")}
                  onChange={() => toggleRole("ACCOUNTANT")}
                />
                <div className="role-text">
                  <strong>ACCOUNTANT</strong>
                  <p>Financial records and billing access</p>
                </div>
              </div>

              <div className="role-item">
                <input
                  type="checkbox"
                  checked={roles.includes("PARENT")}
                  onChange={() => toggleRole("PARENT")}
                />
                <div className="role-text">
                  <strong>PARENT</strong>
                  <p>Student progress and communication access</p>
                </div>
              </div>

              <div className="actions">
                <button className="btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default UsersRoles;
