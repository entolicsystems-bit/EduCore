import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

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

// form validation logic
  const validateForm = () => {
    if (!email.trim()) {
      return "Please enter your email";
    }
    return "";
  };

  // run validation every time email changes
    useEffect(() => {
      const errorMsg = validateForm();
      setError(errorMsg);
      setIsValid(!errorMsg);
  }, [email]);

// runs when user cliks "send otp"
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
    <div className="page">
      <div className="outer-card">
        <div className="grid grid-cols-2">
          {/* LEFT image */}
          <div className="border-2 border-gray-300 bg-white rounded-2xl flex justify-center items-center">
            <div className="w-150 h-160 flex justify-center items-center">
              <img
                src="/forgetpass.png"
                alt="forgot password"
                className="float"
              />
            </div>
          </div>

          {/* RIGHT image */}
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
