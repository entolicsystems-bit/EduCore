import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyOtp.css";

const Otp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setError("Please enter complete OTP");
      return;
    }

    // ✅ Demo OTP check (for UI project)
    if (enteredOtp === "1234") {
      navigate("/reset");
    } else {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="page">
      <div className="outer-card">
        <div className="container">

          {/* LEFT IMAGE */}
          <div className="left-card">
            <div className="art-wrap">
              <img src="/otp.png" alt="OTP illustration" className="float" />
            </div>
          </div>

          {/* RIGHT OTP CARD */}
          <div className="otp-card">
            <h2>Enter OTP</h2>

            {/* OTP INPUTS */}
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                />
              ))}
            </div>

            {error && <p className="error-text">{error}</p>}

            {/* VERIFY BUTTON */}
            <button className="verify-btn" onClick={handleVerify}>
              Verify
            </button>

            {/* RESEND TEXT */}
            <p className="resend-text">Resend OTP in : 00:30</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Otp;
