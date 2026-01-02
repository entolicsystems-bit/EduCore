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
  } , [email]);

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
    setSubmitted(true);// stop page reload

    if (!validateForm()){
      setError("Please enter your email.");
      return;
    }

    // later: API call to send OTP
    navigate("/otp");  // open OTP page
  };

  return (
    <div className="page">
      <div className="outer-card">
        <div className="container">

          {/* LEFT */}
          <div className="left-card">
            <div className="art-wrap">
              <img src="/forgetpass.png" alt="forgot password" className="float" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-card forgot-card">
            <form className="form" onSubmit={handleSendOtp}>
              <h2 className="form-title">Forgot<br /> Password</h2>

              <input
                type="email"
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
