import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isValid, setValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (
      newPassword.trim().length >= 6 &&
      confirmPassword.trim().length >= 6 &&
      newPassword === confirmPassword
    ) {
      setError("");
      setValid(true);
    } else {
      setValid(false);
    }
  }, [newPassword, confirmPassword]);

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

  // Toggle show/hide password
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="page">
      <div className="outer-card">
        <div className="grid grid-cols-2">
          {/* LEFT IMAGE */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center">
            <div className="w-150 h-160 flex justify-center items-center">
              <img src="reset.png" alt="Reset Password" className="float" />
            </div>
          </div>

          {/* RIGHT RESET CARD */}
          <div className="flex justify-end items-center">
            <form
              onSubmit={handleReset}
              className="bg-[#ffffff] px-5 py-5 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
            >
              <h2 className="text-2xl font-bold">Reset Password</h2>
              <div className="border-2 relative border-gray-300 px-3 py-3 rounded-2xl">
                <input
                  type={showPassword ? "text" : "password"}
                  className="outline-none w-full"
                  placeholder="Enter Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <i
                  className="ri-eye-line absolute right-2.5 top-2.5 text-lg text-blue-500 cursor-pointer"
                  onClick={toggleShowPassword}
                ></i>
              </div>

              <div className="border-2 relative border-gray-300 px-3 py-3 rounded-2xl">
                <input
                  type={showPassword ? "text" : "password"}
                  className="outline-none w-full"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i
                  className="ri-eye-line absolute right-2.5 top-2.5 text-lg text-blue-500 cursor-pointer"
                  onClick={toggleShowPassword}
                ></i>
              </div>

              {error && <p className="error-text">{error}</p>}

              <button className="btn" type="submit" disabled={!isValid}>
                Reset
              </button>
              <p className="back-login" onClick={() => navigate("/")}>
                Go Back to Login
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
