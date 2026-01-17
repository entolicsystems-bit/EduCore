import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  // store email state
  const [email, setEmail] = useState("");

  // Controls form validation and submission state
  const [isValid, setIsValid] = useState(false);

  // Tracks if user tried to submit the form
  const [submitted, setSubmitted] = useState(false);

  // Holds validation error messages
  const [error, setError] = useState("");

  // Validates the form fields
  const validateForm = () => {
    if (!email.trim()) {
      return "Please enter your email";
    }
    return "";
  };

  // Re-validate form whenever email changes
  useEffect(() => {
    const errorMsg = validateForm();
    setError(errorMsg);
    setIsValid(!errorMsg);
  }, [email]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setSubmitted(true); // stop page reload

    // stop if form is invalid
    if (!isValid) {
      return;
    }

    // later: API call to send OTP
    navigate("/otp"); // open OTP page
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] flex justify-center items-center px-6 py-8">
      {/* OUTER CARD */}
      <div className="w-full max-w-7xl rounded-3xl border border-gray-300 p-8 outer-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT BIG WHITE PANEL */}
          <div className="bg-white rounded-2xl p-10 flex justify-center items-center min-h-155 border border-gray-300">
            <img
              src="/forgetpass.png"
              alt="forgot password"
              className="w-full max-w-130 float h-auto object-contain"
            />
          </div>

          {/* RIGHT SMALL FORM CARD */}
          <div className="flex justify-center items-center">
            <form
              className="bg-white w-full max-w-md px-8 py-10 flex flex-col gap-6 border border-gray-300 rounded-2xl"
              onSubmit={handleSendOtp}
            >
              <h2 className="text-2xl font-bold leading-tight">
                Forgot <br /> Password
              </h2>

              <input
                type="email"
                className="border-2 w-full border-gray-300 px-4 py-3 rounded-xl"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={!isValid}
                className="bg-gray-300 text-white py-3 rounded-full"
              >
                Send OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
