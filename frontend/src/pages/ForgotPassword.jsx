import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    validateForm();
  }, [email]);

  const validateForm = () => {
    if (!email.trim()) {
      setIsValid(false);
      return false;
    }

    setIsValid(true);
    return true;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setSubmitted(true); // stop page reload

    if (!validateForm()) {
      setError("Please enter your email.");
      return;
    }

    // later: API call to send OTP
    navigate("/otp"); // open OTP page
  };

  return (
    <div className="page">
      <div className="outer-card">
        <div className="grid grid-cols-2">
          {/* LEFT */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center">
            <div className="w-150 h-160 flex justify-center items-center">
              <img
                src="/forgetpass.png"
                alt="forgot password"
                className="float"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-end items-center">
            <form
              className="bg-[#ffffff] px-5 py-5 flex flex-col gap-7 border-2 border-gray-300 rounded-2xl w-90"
              onSubmit={handleSendOtp}
            >
              <h2 className="text-2xl font-bold">Forgot Password</h2>

              <input
                type="email"
                className="border-2 border-gray-300 px-3 py-3 rounded-2xl"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="btn" type="submit" disabled={!isValid}>
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
