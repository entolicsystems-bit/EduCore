import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyOtp.css";

const Otp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft]= useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    }, [timeLeft]);


  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // auto focus to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
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

  const handleResendOtp = () => {
    setOtp(["", "", "", ""]);
    setTimeLeft(30);
    setCanResend(false);
    setError("");
    inputRefs.current[0].focus();
  };

  const isOtpComplete = otp.every((digit) => digit !== "");


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
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e.target.value, index)}
                />
              ))}
            </div>

            {error && <p className="error-text">{error}</p>}

            {/* VERIFY BUTTON */}
            <button className="verify-btn"
             onClick={handleVerify}
             disabled={!isOtpComplete}
             >
              Verify
            </button>

            {/* RESEND BUTTON */}
            {!canResend ? (
              <p className="resend-text">Resend OTP in : 00:{timeLeft.toString().padStart(2, "0")}
              </p>
            ) : (
              <button className="resend-btn" onClick={handleResendOtp}>
                Resend OTP
              </button>
            )}

          
          </div>

        </div>
      </div>
    </div>
  );
};

export default Otp;
