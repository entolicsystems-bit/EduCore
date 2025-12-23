import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // ✅ Update password in localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.password = newPassword;
      localStorage.setItem("user", JSON.stringify(user));
    }

    alert("Password reset successful");
    navigate("/");
  };

  return (
    <div className="page">
      <div className="outer-card">
        <div className="container">

          {/* LEFT IMAGE */}
          <div className="left-card">
            <div className="art-wrap">
              <img
                src="reset.png" 
                alt="Reset Password"
                className="float"
              />
            </div>
          </div>

          {/* RIGHT RESET CARD */}
          <div className="reset-card">
            <h2>Reset Password</h2>

            <form onSubmit={handleReset}>
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {error && <p className="error-text">{error}</p>}

              <button className="reset-btn" type="submit">
                Reset
              </button>
            </form>

            <p className="back-login" onClick={() => navigate("/")}>
              Go Back to Login
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
