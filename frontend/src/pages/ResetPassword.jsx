import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  // form states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [error, setError] = useState("");
  const [isValid, setValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [reShowPassword, setReShowPassword] = useState(false);

  // Validate whenever user types
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

  // sumbit reset password
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

    alert("Password reset successful");
    navigate("/");
  };

  // Toggle show/hide password
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleShowRePassword = () => {
    setReShowPassword((prev) => !prev);
  };

  return (
    <div className="container bg-[#eef4ff] flex justify-center items-center px-14 py-10">
      <div className="container-box rounded-2xl p-4 outer-card border-2 border-gray-300">
        <div className="grid grid-cols-2">
          {/* LEFT IMAGE */}
          <div className="left-card border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center p-6 md:p-10">
            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl flex justify-center items-center">
              <img
                src="reset.png"
                alt="Reset Password"
                className="w-full float h-auto object-contain"
              />
              <h1 className="font-bold text-lg hidden">EduCore</h1>
            </div>
          </div>

          {/* RIGHT RESET CARD */}
          <div className="right-card flex justify-end items-center">
            <form
              onSubmit={handleReset}
              className="bg-[#ffffff] px-5 py-10 mr-14 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
            >
              <h2 className="text-2xl font-bold">
                Reset <br /> Password
              </h2>
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
                  type={reShowPassword ? "text" : "password"}
                  className="outline-none w-full"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i
                  className="ri-eye-line absolute right-2.5 top-2.5 text-lg text-blue-500 cursor-pointer"
                  onClick={toggleShowRePassword}
                ></i>
              </div>

              {error && <p className="error-text">{error}</p>}

              <button className="btn text-lg" type="submit" disabled={!isValid}>
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
